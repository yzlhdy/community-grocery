import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { BannerScene, PromotionType } from "../../generated/prisma/client";
import { MarketingService } from "../marketing/marketing.service";
import { UserService } from "../user/user.service";
import { HomeQueryDto } from "./dto/home-query.dto";

/**
 * 提供小程序页面级聚合接口，避免小程序多次请求拼装首屏数据。
 */
@Injectable()
export class MiniappService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly marketingService: MarketingService,
    private readonly userService: UserService,
  ) {}

  /**
   * 查询首页首屏所需的聚合数据。
   */
  async getHome(customerId: string, query: HomeQueryDto) {
    const community = await this.resolveCommunity(query.communityId);
    const [pickupPoint, banners, categories, seckill, recommend, orderSummary, cartBadge] =
      await Promise.all([
        this.resolvePickupPoint(community?.id),
        this.marketingService.findActiveBanners(BannerScene.HOME_TOP),
        this.prisma.category.findMany({
          where: { enabled: true, level: 1 },
          orderBy: [{ sort: "asc" }, { createdAt: "desc" }],
          take: 8,
        }),
        this.marketingService.findActiveCampaign(PromotionType.SECKILL),
        this.marketingService.findActiveCampaign(PromotionType.RECOMMEND),
        this.userService.getOrderSummary(customerId),
        this.prisma.cartItem.count({ where: { customerId } }),
      ]);

    return {
      community,
      pickupPoint,
      leader: pickupPoint
        ? {
            name: pickupPoint.leaderName ?? pickupPoint.contactName,
            avatarUrl: pickupPoint.leaderAvatarUrl,
            phone: pickupPoint.servicePhone ?? pickupPoint.contactPhone,
            serviceTimeRange: pickupPoint.serviceTimeRange ?? pickupPoint.pickupTimeRange,
          }
        : null,
      banners,
      categories,
      seckill,
      recommend,
      orderSummary,
      badges: {
        cart: cartBadge,
        pendingPayment: orderSummary.pendingPayment,
        pendingPickup: orderSummary.pendingPickup,
      },
    };
  }

  /**
   * 查询分类页所需的左侧分类和右侧商品首屏数据。
   */
  async getCategoryPage(categoryId?: string) {
    const categories = await this.prisma.category.findMany({
      where: { enabled: true },
      orderBy: [{ level: "asc" }, { sort: "asc" }],
    });
    const selectedCategoryId = categoryId ?? categories.find((item) => item.level === 1)?.id;
    const products = await this.prisma.product.findMany({
      where: {
        enabled: true,
        categoryId: selectedCategoryId,
      },
      include: { skus: { where: { enabled: true } } },
      orderBy: [{ sort: "asc" }, { sales: "desc" }, { createdAt: "desc" }],
    });

    return {
      categories: categories
        .filter((category) => !category.parentId)
        .map((category) => ({
          ...category,
          children: categories.filter((item) => item.parentId === category.id),
        })),
      selectedCategoryId,
      products: products.map((product) => ({
        ...product,
        skus: product.skus.map((sku) => ({
          ...sku,
          price: Number(sku.price),
          marketPrice: sku.marketPrice ? Number(sku.marketPrice) : null,
        })),
      })),
    };
  }

  /**
   * 查询“我的”页面聚合数据。
   */
  getMine(customerId: string) {
    return this.userService.getProfileSummary(customerId);
  }

  /**
   * 解析当前小区，未传入时返回第一个启用小区。
   */
  private resolveCommunity(communityId?: string) {
    return this.prisma.community.findFirst({
      where: communityId ? { id: communityId, enabled: true } : { enabled: true },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * 解析当前小区下默认自提点。
   */
  private resolvePickupPoint(communityId?: string) {
    if (!communityId) return null;
    return this.prisma.pickupPoint.findFirst({
      where: { communityId, enabled: true },
      orderBy: { createdAt: "desc" },
    });
  }
}
