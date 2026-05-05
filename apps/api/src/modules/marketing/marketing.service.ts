import { Injectable } from "@nestjs/common";
import { BannerScene, PromotionType } from "../../generated/prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";

/**
 * 提供小程序页面所需的营销资源查询能力。
 */
@Injectable()
export class MarketingService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 查询当前生效的首页 banner。
   */
  findActiveBanners(scene?: BannerScene) {
    const now = new Date();
    return this.prisma.homeBanner.findMany({
      where: {
        scene,
        enabled: true,
        OR: [{ startsAt: null }, { startsAt: { lte: now } }],
        AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: now } }] }],
      },
      orderBy: [{ sort: "asc" }, { createdAt: "desc" }],
    });
  }

  /**
   * 查询当前生效的营销活动及其商品。
   */
  async findActiveCampaign(type: PromotionType) {
    const now = new Date();
    const campaign = await this.prisma.promotionCampaign.findFirst({
      where: {
        type,
        enabled: true,
        OR: [{ startsAt: null }, { startsAt: { lte: now } }],
        AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: now } }] }],
      },
      include: {
        products: {
          include: {
            product: { include: { skus: { where: { enabled: true } } } },
            sku: true,
          },
          orderBy: { sort: "asc" },
        },
      },
      orderBy: [{ sort: "asc" }, { createdAt: "desc" }],
    });

    if (!campaign) {
      return null;
    }

    return {
      ...campaign,
      products: campaign.products.map((item) => ({
        id: item.id,
        discountLabel: item.discountLabel,
        promoPrice: item.promoPrice ? Number(item.promoPrice) : null,
        product: {
          ...item.product,
          skus: item.product.skus.map((sku) => ({
            ...sku,
            price: Number(sku.price),
            marketPrice: sku.marketPrice ? Number(sku.marketPrice) : null,
          })),
        },
        sku: item.sku
          ? {
              ...item.sku,
              price: Number(item.sku.price),
              marketPrice: item.sku.marketPrice ? Number(item.sku.marketPrice) : null,
            }
          : null,
      })),
    };
  }

  /**
   * 查询当前可领取优惠券模板。
   */
  findActiveCouponTemplates() {
    const now = new Date();
    return this.prisma.couponTemplate.findMany({
      where: {
        enabled: true,
        OR: [{ startsAt: null }, { startsAt: { lte: now } }],
        AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: now } }] }],
      },
      orderBy: [{ createdAt: "desc" }],
    });
  }
}
