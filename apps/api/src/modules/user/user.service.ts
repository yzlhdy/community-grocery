import { HttpStatus, Injectable } from "@nestjs/common";
import { PageQueryDto } from "../../common/dto/page-query.dto";
import { BusinessException } from "../../common/exceptions/business.exception";
import { ErrorCode } from "../../common/exceptions/error-code.enum";
import { PrismaService } from "../../common/prisma/prisma.service";
import { createPageResult, resolvePagination } from "../../common/utils/pagination";
import { OrderStatus } from "../../generated/prisma/client";
import { CouponService } from "../coupon/coupon.service";
import { UpsertAddressDto } from "./dto/upsert-address.dto";

/**
 * 提供用户中心、收藏、浏览记录和地址管理能力。
 */
@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly couponService: CouponService,
  ) {}

  /**
   * 查询“我的”页面聚合数据。
   */
  async getProfileSummary(customerId: string) {
    const [customer, orderSummary, couponCount, favoriteCount, addressCount, browsingHistoryCount] =
      await Promise.all([
        this.prisma.customer.findUnique({ where: { id: customerId } }),
        this.getOrderSummary(customerId),
        this.couponService.countAvailable(customerId),
        this.prisma.favoriteProduct.count({ where: { customerId } }),
        this.prisma.customerAddress.count({ where: { customerId } }),
        this.prisma.browsingHistory.count({ where: { customerId } }),
      ]);

    if (!customer) {
      throw new BusinessException(ErrorCode.NOT_FOUND, "用户不存在", HttpStatus.NOT_FOUND);
    }

    return {
      customer: {
        ...customer,
        walletBalance: Number(customer.walletBalance),
      },
      orderSummary,
      couponCount,
      favoriteCount,
      addressCount,
      browsingHistoryCount,
    };
  }

  /**
   * 查询用户订单状态数量。
   */
  async getOrderSummary(customerId: string) {
    const grouped = await this.prisma.order.groupBy({
      by: ["status"],
      where: { customerId },
      _count: { status: true },
    });
    const countOf = (status: OrderStatus) =>
      grouped.find((item) => item.status === status)?._count.status ?? 0;

    return {
      pendingPayment: countOf(OrderStatus.PENDING_PAYMENT),
      pendingPickup: countOf(OrderStatus.PENDING_PICKUP),
      completed: countOf(OrderStatus.COMPLETED),
      refunding: countOf(OrderStatus.REFUNDING) + countOf(OrderStatus.REFUNDED),
    };
  }

  /**
   * 收藏商品。
   */
  favoriteProduct(customerId: string, productId: string) {
    return this.prisma.favoriteProduct.upsert({
      where: {
        customerId_productId: {
          customerId,
          productId,
        },
      },
      update: {},
      create: {
        customerId,
        productId,
      },
    });
  }

  /**
   * 取消收藏商品。
   */
  unfavoriteProduct(customerId: string, productId: string) {
    return this.prisma.favoriteProduct.delete({
      where: {
        customerId_productId: {
          customerId,
          productId,
        },
      },
    });
  }

  /**
   * 查询我的收藏商品。
   */
  async findFavoriteProducts(customerId: string, query: PageQueryDto) {
    const pagination = resolvePagination(query);
    const where = { customerId };
    const [list, total] = await Promise.all([
      this.prisma.favoriteProduct.findMany({
        where,
        include: { product: { include: { skus: { where: { enabled: true } } } } },
        orderBy: { createdAt: "desc" },
        skip: pagination.skip,
        take: pagination.take,
      }),
      this.prisma.favoriteProduct.count({ where }),
    ]);

    return createPageResult({ list, total, page: pagination.page, pageSize: pagination.pageSize });
  }

  /**
   * 记录商品浏览历史。
   */
  recordBrowsingHistory(customerId: string, productId: string) {
    return this.prisma.browsingHistory.create({
      data: {
        customerId,
        productId,
      },
    });
  }

  /**
   * 查询商品浏览历史。
   */
  async findBrowsingHistory(customerId: string, query: PageQueryDto) {
    const pagination = resolvePagination(query);
    const where = { customerId };
    const [list, total] = await Promise.all([
      this.prisma.browsingHistory.findMany({
        where,
        include: { product: { include: { skus: { where: { enabled: true } } } } },
        orderBy: { createdAt: "desc" },
        skip: pagination.skip,
        take: pagination.take,
      }),
      this.prisma.browsingHistory.count({ where }),
    ]);

    return createPageResult({ list, total, page: pagination.page, pageSize: pagination.pageSize });
  }

  /**
   * 查询我的地址列表。
   */
  findAddresses(customerId: string) {
    return this.prisma.customerAddress.findMany({
      where: { customerId },
      orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
    });
  }

  /**
   * 创建或更新收货地址。
   */
  async upsertAddress(customerId: string, dto: UpsertAddressDto) {
    return this.prisma.$transaction(async (tx) => {
      if (dto.isDefault) {
        await tx.customerAddress.updateMany({
          where: { customerId },
          data: { isDefault: false },
        });
      }

      const data = {
        customerId,
        contactName: dto.contactName,
        contactPhone: dto.contactPhone,
        province: dto.province,
        city: dto.city,
        district: dto.district,
        detailAddress: dto.detailAddress,
        isDefault: dto.isDefault ?? false,
      };

      return dto.id
        ? tx.customerAddress.update({ where: { id: dto.id, customerId }, data })
        : tx.customerAddress.create({ data });
    });
  }
}
