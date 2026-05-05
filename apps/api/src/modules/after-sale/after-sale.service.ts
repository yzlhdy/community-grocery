import { HttpStatus, Injectable } from "@nestjs/common";
import { BusinessException } from "../../common/exceptions/business.exception";
import { ErrorCode } from "../../common/exceptions/error-code.enum";
import { PrismaService } from "../../common/prisma/prisma.service";
import { createPageResult, resolvePagination } from "../../common/utils/pagination";
import { createAfterSaleNo } from "../../common/utils/order-number";
import { AfterSaleStatus, NotificationType, OrderStatus, PaymentStatus, Prisma } from "../../generated/prisma/client";
import { NotificationService } from "../notification/notification.service";
import { PointsService } from "../points/points.service";
import { CreateAfterSaleDto } from "./dto/create-after-sale.dto";
import { AfterSaleQueryDto } from "./dto/after-sale-query.dto";
import { ReviewAfterSaleDto } from "./dto/review-after-sale.dto";

/**
 * 提供售后申请、审核和退款确认能力。
 */
@Injectable()
export class AfterSaleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly pointsService: PointsService,
  ) {}

  /**
   * 查询当前用户售后单。
   */
  async findMine(customerId: string, query: AfterSaleQueryDto = {}) {
    const pagination = resolvePagination(query);
    const where = { customerId, status: query.status };
    const [list, total] = await Promise.all([
      this.prisma.afterSale.findMany({
        where,
        include: { items: { include: { orderItem: true } }, order: true },
        orderBy: { createdAt: "desc" },
        skip: pagination.skip,
        take: pagination.take,
      }),
      this.prisma.afterSale.count({ where }),
    ]);
    return createPageResult({ list, total, page: pagination.page, pageSize: pagination.pageSize });
  }

  /**
   * 查询售后单详情。
   */
  async findOne(id: string, customerId?: string) {
    const afterSale = await this.prisma.afterSale.findFirst({
      where: { id, customerId },
      include: { items: { include: { orderItem: true } }, order: true },
    });
    if (!afterSale) {
      throw new BusinessException(ErrorCode.NOT_FOUND, "售后单不存在", HttpStatus.NOT_FOUND);
    }
    return afterSale;
  }

  /**
   * 创建售后申请。
   */
  async create(customerId: string, dto: CreateAfterSaleDto) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findFirst({
        where: {
          id: dto.orderId,
          customerId,
          status: { in: [OrderStatus.PENDING_PICKUP, OrderStatus.COMPLETED] },
        },
        include: { items: true },
      });
      if (!order) {
        throw new BusinessException(ErrorCode.NOT_FOUND, "可售后订单不存在", HttpStatus.NOT_FOUND);
      }

      let refundAmount = new Prisma.Decimal(0);
      const items = dto.items.map((item) => {
        const orderItem = order.items.find((candidate) => candidate.id === item.orderItemId);
        if (!orderItem) {
          throw new BusinessException(ErrorCode.NOT_FOUND, "订单商品不存在", HttpStatus.NOT_FOUND);
        }
        if (item.quantity > orderItem.quantity) {
          throw new BusinessException(ErrorCode.VALIDATION_FAILED, "售后数量不能超过购买数量");
        }
        const itemRefundAmount = orderItem.price.mul(item.quantity);
        refundAmount = refundAmount.plus(itemRefundAmount);
        return {
          orderItemId: item.orderItemId,
          quantity: item.quantity,
          refundAmount: itemRefundAmount,
        };
      });

      const afterSale = await tx.afterSale.create({
        data: {
          afterSaleNo: createAfterSaleNo(),
          customerId,
          orderId: order.id,
          type: dto.type,
          reason: dto.reason,
          description: dto.description,
          refundAmount,
          items: { create: items },
        },
        include: { items: true },
      });

      await tx.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.REFUNDING },
      });

      return afterSale;
    });
  }

  /**
   * 后台审核售后单。
   */
  async review(id: string, dto: ReviewAfterSaleDto) {
    const afterSale = await this.prisma.afterSale.update({
      where: { id },
      data: {
        status: dto.approved ? AfterSaleStatus.APPROVED : AfterSaleStatus.REJECTED,
        rejectReason: dto.approved ? null : dto.rejectReason,
        reviewedAt: new Date(),
      },
      include: { order: true },
    });

    await this.notificationService.create({
      customerId: afterSale.customerId,
      type: NotificationType.AFTER_SALE,
      title: dto.approved ? "售后审核通过" : "售后审核未通过",
      content: dto.approved ? "您的售后申请已通过审核" : (dto.rejectReason ?? "您的售后申请未通过审核"),
      payload: { afterSaleId: afterSale.id },
    });

    return afterSale;
  }

  /**
   * 确认售后退款完成。
   */
  async markRefunded(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const afterSale = await tx.afterSale.findUnique({
        where: { id },
        include: { order: true, items: true },
      });
      if (!afterSale) {
        throw new BusinessException(ErrorCode.NOT_FOUND, "售后单不存在", HttpStatus.NOT_FOUND);
      }
      if (afterSale.status !== AfterSaleStatus.APPROVED) {
        throw new BusinessException(ErrorCode.INVALID_ORDER_STATUS, "只有审核通过的售后单可以确认退款");
      }

      await tx.payment.updateMany({
        where: { orderId: afterSale.orderId, status: PaymentStatus.PAID },
        data: { status: PaymentStatus.REFUNDED },
      });

      const updated = await tx.afterSale.update({
        where: { id },
        data: {
          status: AfterSaleStatus.REFUNDED,
          refundedAt: new Date(),
        },
      });

      await tx.order.update({
        where: { id: afterSale.orderId },
        data: { status: OrderStatus.REFUNDED },
      });

      const deductPoints = Math.floor(Number(afterSale.refundAmount));
      if (deductPoints > 0) {
        await this.pointsService.deductPoints(tx, {
          customerId: afterSale.customerId,
          points: deductPoints,
          description: "售后退款扣减积分",
          orderId: afterSale.orderId,
        });
      }

      return updated;
    });
  }
}
