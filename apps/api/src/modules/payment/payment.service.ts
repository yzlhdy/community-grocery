import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { BusinessException } from "../../common/exceptions/business.exception";
import { ErrorCode } from "../../common/exceptions/error-code.enum";
import { PrismaService } from "../../common/prisma/prisma.service";
import { RedisService } from "../../common/redis/redis.service";
import { OrderStatus, PaymentStatus } from "../../generated/prisma/client";
import { InventoryService } from "../inventory/inventory.service";
import { WechatNotifyDto } from "./dto/wechat-notify.dto";
import {
  WECHAT_PAYMENT_PROVIDER,
  type WechatPaymentProvider,
} from "./providers/wechat-payment.types";

@Injectable()
/**
 * Handles WeChat payment creation and callback idempotency.
 */
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly inventoryService: InventoryService,
    @Inject(WECHAT_PAYMENT_PROVIDER)
    private readonly wechatPaymentProvider: WechatPaymentProvider,
  ) {}

  /**
   * Creates a WeChat payment request for a pending customer order.
   */
  async createWechatPayment(orderId: string, customerId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, customerId },
      include: { customer: true, items: true },
    });
    if (!order) {
      throw new BusinessException(ErrorCode.NOT_FOUND, "Order not found", HttpStatus.NOT_FOUND);
    }
    if (order.status !== OrderStatus.PENDING_PAYMENT) {
      throw new BusinessException(
        ErrorCode.INVALID_ORDER_STATUS,
        "Order is not pending payment",
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
   * Processes a WeChat payment callback exactly once per payment event.
   */
  async handleWechatNotify(dto: WechatNotifyDto) {
    const payment = await this.prisma.payment.findUnique({
      where: { paymentNo: dto.paymentNo },
      include: { order: { include: { items: true } } },
    });
    if (!payment) {
      throw new BusinessException(ErrorCode.NOT_FOUND, "Payment not found", HttpStatus.NOT_FOUND);
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
    });

    return { success: true };
  }

  /**
   * Lists payment records for an order.
   */
  findByOrder(orderId: string) {
    return this.prisma.payment.findMany({
      where: { orderId },
      orderBy: { createdAt: "desc" },
    });
  }
}
