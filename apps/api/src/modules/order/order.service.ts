import { HttpStatus, Injectable } from "@nestjs/common";
import { BusinessException } from "../../common/exceptions/business.exception";
import { ErrorCode } from "../../common/exceptions/error-code.enum";
import { PrismaService } from "../../common/prisma/prisma.service";
import { createOrderNo, createPickupCode } from "../../common/utils/order-number";
import { OrderStatus, Prisma } from "../../generated/prisma/client";
import { InventoryService } from "../inventory/inventory.service";
import { CreateOrderDto } from "./dto/create-order.dto";

@Injectable()
/**
 * Handles order creation, stock locking, cancellation, and pickup completion.
 */
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly inventoryService: InventoryService,
  ) {}

  /**
   * Lists orders for a customer.
   */
  findMine(customerId: string) {
    return this.prisma.order.findMany({
      where: { customerId },
      include: { items: true, payments: true, pickupPoint: true },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Reads one order, optionally scoped to a customer.
   */
  async findOne(id: string, customerId?: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, customerId },
      include: { items: true, payments: true, community: true, pickupPoint: true },
    });
    if (!order) {
      throw new BusinessException(ErrorCode.NOT_FOUND, "Order not found", HttpStatus.NOT_FOUND);
    }
    return order;
  }

  /**
   * Creates an unpaid order and locks SKU stock in a single transaction.
   */
  async create(customerId: string, dto: CreateOrderDto) {
    if (!dto.items.length) {
      throw new BusinessException(ErrorCode.VALIDATION_FAILED, "Order items cannot be empty");
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
        throw new BusinessException(ErrorCode.INVALID_PICKUP_POINT, "Invalid pickup point");
      }

      const skuIds = dto.items.map((item) => item.skuId);
      const uniqueSkuIds = new Set(skuIds);
      if (uniqueSkuIds.size !== skuIds.length) {
        throw new BusinessException(ErrorCode.VALIDATION_FAILED, "Duplicate sku is not allowed");
      }
      const skus = await tx.sku.findMany({
        where: { id: { in: skuIds }, enabled: true },
        include: { product: true },
      });
      if (skus.length !== skuIds.length) {
        throw new BusinessException(ErrorCode.NOT_FOUND, "Invalid sku", HttpStatus.NOT_FOUND);
      }

      let totalAmount = new Prisma.Decimal(0);
      for (const item of dto.items) {
        if (item.quantity < 1) {
          throw new BusinessException(
            ErrorCode.VALIDATION_FAILED,
            "Quantity must be greater than zero",
          );
        }

        const sku = skus.find((candidate) => candidate.id === item.skuId);
        if (!sku) {
          throw new BusinessException(ErrorCode.NOT_FOUND, "Invalid sku", HttpStatus.NOT_FOUND);
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

      const order = await tx.order.create({
        data: {
          orderNo: createOrderNo(),
          customerId,
          communityId: dto.communityId,
          pickupPointId: dto.pickupPointId,
          pickupCode: createPickupCode(),
          totalAmount,
          discountAmount: 0,
          payableAmount: totalAmount,
          items: {
            create: dto.items.map((item) => {
              const sku = skus.find((candidate) => candidate.id === item.skuId);
              if (!sku) {
                throw new BusinessException(ErrorCode.NOT_FOUND, "Invalid sku", HttpStatus.NOT_FOUND);
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

      return order;
    });
  }

  /**
   * Cancels an unpaid order and releases locked stock.
   */
  async cancel(id: string, customerId?: string) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findFirst({
        where: { id, customerId },
        include: { items: true },
      });
      if (!order) {
        throw new BusinessException(ErrorCode.NOT_FOUND, "Order not found", HttpStatus.NOT_FOUND);
      }
      if (order.status !== OrderStatus.PENDING_PAYMENT) {
        throw new BusinessException(
          ErrorCode.INVALID_ORDER_STATUS,
          "Only pending payment orders can be cancelled",
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
   * Marks a paid order as picked up by the customer.
   */
  async completePickup(id: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new BusinessException(ErrorCode.NOT_FOUND, "Order not found", HttpStatus.NOT_FOUND);
    }
    if (order.status !== OrderStatus.PENDING_PICKUP) {
      throw new BusinessException(
        ErrorCode.INVALID_ORDER_STATUS,
        "Only pending pickup orders can be completed",
      );
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        status: OrderStatus.COMPLETED,
        completedAt: new Date(),
      },
    });
  }
}
