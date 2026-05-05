import { HttpStatus, Injectable } from "@nestjs/common";
import { BusinessException } from "../../common/exceptions/business.exception";
import { ErrorCode } from "../../common/exceptions/error-code.enum";
import { PrismaService } from "../../common/prisma/prisma.service";
import { UpsertCartItemDto } from "./dto/upsert-cart-item.dto";

@Injectable()
/**
 * Manages customer cart items by SKU.
 */
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Lists all cart items for a customer with product and SKU detail.
   */
  async findMine(customerId: string) {
    const items = await this.prisma.cartItem.findMany({
      where: { customerId },
      include: {
        sku: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return items.map((item) => ({
      ...item,
      sku: {
        ...item.sku,
        price: Number(item.sku.price),
        marketPrice: item.sku.marketPrice ? Number(item.sku.marketPrice) : null,
      },
    }));
  }

  /**
   * Adds or replaces a SKU quantity in the customer's cart.
   */
  async upsert(customerId: string, dto: UpsertCartItemDto) {
    if (dto.quantity < 1) {
      throw new BusinessException(ErrorCode.VALIDATION_FAILED, "Quantity must be greater than zero");
    }

    const sku = await this.prisma.sku.findUnique({
      where: { id: dto.skuId },
    });
    if (!sku || !sku.enabled) {
      throw new BusinessException(ErrorCode.NOT_FOUND, "Sku not found", HttpStatus.NOT_FOUND);
    }
    if (sku.stock - sku.lockedStock < dto.quantity) {
      throw new BusinessException(ErrorCode.INSUFFICIENT_STOCK, "Insufficient stock");
    }

    return this.prisma.cartItem.upsert({
      where: {
        customerId_skuId: {
          customerId,
          skuId: dto.skuId,
        },
      },
      update: {
        quantity: dto.quantity,
      },
      create: {
        customerId,
        skuId: dto.skuId,
        quantity: dto.quantity,
      },
    });
  }

  /**
   * Removes one SKU from the customer's cart.
   */
  remove(customerId: string, skuId: string) {
    return this.prisma.cartItem.delete({
      where: {
        customerId_skuId: {
          customerId,
          skuId,
        },
      },
    });
  }
}
