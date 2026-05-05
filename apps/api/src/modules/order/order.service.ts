import { HttpStatus, Injectable } from "@nestjs/common";
import { BusinessException } from "../../common/exceptions/business.exception";
import { ErrorCode } from "../../common/exceptions/error-code.enum";
import { PrismaService } from "../../common/prisma/prisma.service";
import { createPageResult, resolvePagination } from "../../common/utils/pagination";
import { createOrderNo, createPickupCode } from "../../common/utils/order-number";
import { CustomerCouponStatus, NotificationType, OrderStatus, Prisma } from "../../generated/prisma/client";
import { InventoryService } from "../inventory/inventory.service";
import { NotificationService } from "../notification/notification.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrderQueryDto } from "./dto/order-query.dto";

@Injectable()
/**
 * 处理订单创建、库存锁定、订单取消和自提完成。
 */
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly inventoryService: InventoryService,
    private readonly notificationService: NotificationService,
  ) {}

  /**
   * 查询指定用户的订单列表。
   */
  async findMine(customerId: string, query: OrderQueryDto = {}) {
    const pagination = resolvePagination(query);
    const where = { customerId, status: query.status };
    const [list, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: { items: true, payments: true, pickupPoint: true },
        orderBy: { createdAt: "desc" },
        skip: pagination.skip,
        take: pagination.take,
      }),
      this.prisma.order.count({ where }),
    ]);
    return createPageResult({ list, total, page: pagination.page, pageSize: pagination.pageSize });
  }

  /**
   * 查询订单状态数量汇总。
   */
  async getSummary(customerId: string) {
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
   * 查询订单详情，可按用户范围限制访问。
   */
  async findOne(id: string, customerId?: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, customerId },
      include: { items: true, payments: true, community: true, pickupPoint: true },
    });
    if (!order) {
      throw new BusinessException(ErrorCode.NOT_FOUND, "订单不存在", HttpStatus.NOT_FOUND);
    }
    return order;
  }

  /**
   * 在同一个事务内创建未支付订单并锁定 SKU 库存。
   */
  async create(customerId: string, dto: CreateOrderDto) {
    if (!dto.items.length) {
      throw new BusinessException(ErrorCode.VALIDATION_FAILED, "订单商品不能为空");
    }

    return this.prisma.$transaction(async (tx) => {
      const pickupPoint = await tx.pickupPoint.findFirst({
        where: {
          id: dto.pickupPointId,
          communityId: dto.communityId,
          enabled: true,
        },
      });
      if (!pickupPoint) {
        throw new BusinessException(ErrorCode.INVALID_PICKUP_POINT, "无效的自提点");
      }

      const skuIds = dto.items.map((item) => item.skuId);
      const uniqueSkuIds = new Set(skuIds);
      if (uniqueSkuIds.size !== skuIds.length) {
        throw new BusinessException(ErrorCode.VALIDATION_FAILED, "不允许重复选择同一个 SKU");
      }
      const skus = await tx.sku.findMany({
        where: { id: { in: skuIds }, enabled: true },
        include: { product: true },
      });
      if (skus.length !== skuIds.length) {
        throw new BusinessException(ErrorCode.NOT_FOUND, "无效的 SKU", HttpStatus.NOT_FOUND);
      }

      let totalAmount = new Prisma.Decimal(0);
      for (const item of dto.items) {
        if (item.quantity < 1) {
          throw new BusinessException(
            ErrorCode.VALIDATION_FAILED,
            "数量必须大于 0",
          );
        }

        const sku = skus.find((candidate) => candidate.id === item.skuId);
        if (!sku) {
          throw new BusinessException(ErrorCode.NOT_FOUND, "无效的 SKU", HttpStatus.NOT_FOUND);
        }

        await this.inventoryService.lockSkuStock(
          tx,
          sku.id,
          item.quantity,
          sku.product.name,
          sku.lockedStock,
        );

        totalAmount = totalAmount.plus(sku.price.mul(item.quantity));
      }

      const discountAmount = await this.resolveCouponDiscount(
        tx,
        customerId,
        dto.couponId,
        totalAmount,
      );
      const payableAmount = Prisma.Decimal.max(totalAmount.minus(discountAmount), 0);

      const order = await tx.order.create({
        data: {
          orderNo: createOrderNo(),
          customerId,
          communityId: dto.communityId,
          pickupPointId: dto.pickupPointId,
          pickupCode: createPickupCode(),
          totalAmount,
          discountAmount,
          payableAmount,
          items: {
            create: dto.items.map((item) => {
              const sku = skus.find((candidate) => candidate.id === item.skuId);
              if (!sku) {
                throw new BusinessException(ErrorCode.NOT_FOUND, "无效的 SKU", HttpStatus.NOT_FOUND);
              }
              return {
                skuId: sku.id,
                productName: sku.product.name,
                skuName: sku.name,
                imageUrl: sku.product.imageUrl,
                unit: sku.unit,
                price: sku.price,
                quantity: item.quantity,
              };
            }),
          },
        },
        include: { items: true },
      });

      await tx.cartItem.deleteMany({
        where: {
          customerId,
          skuId: { in: skuIds },
        },
      });

      if (dto.couponId) {
        await tx.customerCoupon.update({
          where: { id: dto.couponId, customerId },
          data: {
            status: CustomerCouponStatus.USED,
            usedAt: new Date(),
            orderId: order.id,
          },
        });
        await tx.couponTemplate.update({
          where: { id: (await tx.customerCoupon.findUniqueOrThrow({ where: { id: dto.couponId } })).templateId },
          data: { usedCount: { increment: 1 } },
        });
      }

      return order;
    });
  }

  /**
   * 计算用户优惠券可抵扣金额。
   */
  private async resolveCouponDiscount(
    tx: Prisma.TransactionClient,
    customerId: string,
    couponId: string | undefined,
    totalAmount: Prisma.Decimal,
  ) {
    if (!couponId) {
      return new Prisma.Decimal(0);
    }

    const coupon = await tx.customerCoupon.findFirst({
      where: {
        id: couponId,
        customerId,
        status: CustomerCouponStatus.AVAILABLE,
      },
      include: { template: true },
    });
    if (!coupon) {
      throw new BusinessException(ErrorCode.NOT_FOUND, "优惠券不存在或不可用", HttpStatus.NOT_FOUND);
    }
    if (!coupon.template.enabled) {
      throw new BusinessException(ErrorCode.BUSINESS_ERROR, "优惠券已失效");
    }
    if (totalAmount.lessThan(coupon.template.thresholdAmount)) {
      throw new BusinessException(ErrorCode.BUSINESS_ERROR, "订单金额未达到优惠券使用门槛");
    }

    return Prisma.Decimal.min(coupon.template.discountAmount, totalAmount);
  }

  /**
   * 取消未支付订单并释放锁定库存。
   */
  async cancel(id: string, customerId?: string) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findFirst({
        where: { id, customerId },
        include: { items: true },
      });
      if (!order) {
        throw new BusinessException(ErrorCode.NOT_FOUND, "订单不存在", HttpStatus.NOT_FOUND);
      }
      if (order.status !== OrderStatus.PENDING_PAYMENT) {
        throw new BusinessException(
          ErrorCode.INVALID_ORDER_STATUS,
          "只有待支付订单可以取消",
        );
      }

      for (const item of order.items) {
        await this.inventoryService.releaseLockedStock(tx, item.skuId, item.quantity);
      }

      return tx.order.update({
        where: { id },
        data: {
          status: OrderStatus.CANCELLED,
          cancelledAt: new Date(),
        },
      });
    });
  }

  /**
   * 将历史订单商品重新加入购物车。
   */
  async reorder(id: string, customerId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, customerId },
      include: { items: true },
    });
    if (!order) {
      throw new BusinessException(ErrorCode.NOT_FOUND, "订单不存在", HttpStatus.NOT_FOUND);
    }

    await this.prisma.$transaction(
      order.items.map((item) =>
        this.prisma.cartItem.upsert({
          where: {
            customerId_skuId: {
              customerId,
              skuId: item.skuId,
            },
          },
          update: {
            quantity: { increment: item.quantity },
            selected: true,
          },
          create: {
            customerId,
            skuId: item.skuId,
            quantity: item.quantity,
            selected: true,
          },
        }),
      ),
    );

    return { success: true };
  }

  /**
   * 将已支付订单标记为用户已自提。
   */
  async completePickup(id: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new BusinessException(ErrorCode.NOT_FOUND, "订单不存在", HttpStatus.NOT_FOUND);
    }
    if (order.status !== OrderStatus.PENDING_PICKUP) {
      throw new BusinessException(
        ErrorCode.INVALID_ORDER_STATUS,
        "只有待自提订单可以完成核销",
      );
    }

    const updated = await this.prisma.order.update({
      where: { id },
      data: {
        status: OrderStatus.COMPLETED,
        completedAt: new Date(),
      },
    });

    await this.notificationService.create({
      customerId: order.customerId,
      type: NotificationType.ORDER,
      title: "订单已完成",
      content: "您的订单已完成自提，欢迎再次购买",
      payload: { orderId: id },
    });

    return updated;
  }
}
