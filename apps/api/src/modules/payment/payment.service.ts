import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { BusinessException } from "../../common/exceptions/business.exception";
import { ErrorCode } from "../../common/exceptions/error-code.enum";
import { PrismaService } from "../../common/prisma/prisma.service";
import { RedisService } from "../../common/redis/redis.service";
import { NotificationType, OrderStatus, PaymentStatus } from "../../generated/prisma/client";
import { InventoryService } from "../inventory/inventory.service";
import { NotificationService } from "../notification/notification.service";
import { PointsService } from "../points/points.service";
import { WechatNotifyDto } from "./dto/wechat-notify.dto";
import {
  WECHAT_PAYMENT_PROVIDER,
  type WechatPaymentProvider,
} from "./providers/wechat-payment.types";

@Injectable()
/**
 * 处理微信支付下单和支付回调幂等。
 */
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly inventoryService: InventoryService,
    private readonly notificationService: NotificationService,
    private readonly pointsService: PointsService,
    @Inject(WECHAT_PAYMENT_PROVIDER)
    private readonly wechatPaymentProvider: WechatPaymentProvider,
  ) {}

  /**
   * 为待支付用户订单创建微信支付请求。
   */
  async createWechatPayment(orderId: string, customerId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, customerId },
      include: { customer: true, items: true },
    });
    if (!order) {
      throw new BusinessException(ErrorCode.NOT_FOUND, "订单不存在", HttpStatus.NOT_FOUND);
    }
    if (order.status !== OrderStatus.PENDING_PAYMENT) {
      throw new BusinessException(
        ErrorCode.INVALID_ORDER_STATUS,
        "订单不是待支付状态",
      );
    }

    const payment = await this.prisma.payment.upsert({
      where: { paymentNo: `PAY-${order.orderNo}` },
      update: {},
      create: {
        orderId: order.id,
        paymentNo: `PAY-${order.orderNo}`,
        amount: order.payableAmount,
      },
    });
    const providerResult = await this.wechatPaymentProvider.createMiniProgramPayment({
      paymentNo: payment.paymentNo,
      orderNo: order.orderNo,
      amountFen: order.payableAmount.mul(100).toNumber(),
      description: order.items.map((item) => item.productName).join("、").slice(0, 120),
      openId: order.customer.openId,
    });

    return {
      paymentNo: payment.paymentNo,
      provider: "wechat",
      prepayId: providerResult.prepayId,
      mock: providerResult.mock,
      payParams: providerResult.payParams,
    };
  }

  /**
   * 对每个支付事件只处理一次微信支付回调。
   */
  async handleWechatNotify(dto: WechatNotifyDto) {
    const payment = await this.prisma.payment.findUnique({
      where: { paymentNo: dto.paymentNo },
      include: { order: { include: { items: true } } },
    });
    if (!payment) {
      throw new BusinessException(ErrorCode.NOT_FOUND, "支付单不存在", HttpStatus.NOT_FOUND);
    }

    const idempotencyKey = `payment:wechat:${dto.transactionId ?? dto.paymentNo}`;
    const firstSeen = await this.redisService.setIdempotencyKey(idempotencyKey, 60 * 60 * 24);
    if (!firstSeen || payment.status === PaymentStatus.PAID) {
      return { success: true, duplicated: true };
    }

    if (dto.status === "FAILED") {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.FAILED,
          rawPayload: dto.rawPayload === undefined ? undefined : JSON.stringify(dto.rawPayload),
        },
      });
      return { success: true };
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.PAID,
          providerTxnId: dto.transactionId,
          rawPayload: dto.rawPayload === undefined ? undefined : JSON.stringify(dto.rawPayload),
          paidAt: new Date(),
        },
      });

      if (payment.order.status !== OrderStatus.PENDING_PAYMENT) {
        return;
      }

      for (const item of payment.order.items) {
        await this.inventoryService.confirmLockedStock(tx, item.skuId, item.quantity);
      }

      await tx.order.update({
        where: { id: payment.orderId },
        data: {
          status: OrderStatus.PENDING_PICKUP,
          paidAt: new Date(),
        },
      });

      const rewardPoints = Math.floor(Number(payment.amount));
      if (rewardPoints > 0) {
        await this.pointsService.addPoints(tx, {
          customerId: payment.order.customerId,
          points: rewardPoints,
          description: "订单支付奖励积分",
          orderId: payment.orderId,
        });
      }
    });

    await this.notificationService.create({
      customerId: payment.order.customerId,
      type: NotificationType.PAYMENT,
      title: "支付成功",
      content: "您的订单已支付成功，请按时到自提点取货",
      payload: { orderId: payment.orderId, paymentNo: payment.paymentNo },
    });

    return { success: true };
  }

  /**
   * 查询订单支付记录。
   */
  findByOrder(orderId: string) {
    return this.prisma.payment.findMany({
      where: { orderId },
      orderBy: { createdAt: "desc" },
    });
  }
}
