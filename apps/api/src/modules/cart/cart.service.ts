import { HttpStatus, Injectable } from "@nestjs/common";
import { BusinessException } from "../../common/exceptions/business.exception";
import { ErrorCode } from "../../common/exceptions/error-code.enum";
import { PrismaService } from "../../common/prisma/prisma.service";
import { UpdateCartItemSelectedDto } from "./dto/update-cart-item-selected.dto";
import { UpsertCartItemDto } from "./dto/upsert-cart-item.dto";

@Injectable()
/**
 * 按 SKU 管理用户购物车。
 */
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 查询用户购物车，并带出商品和 SKU 明细。
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
   * 查询购物车结算汇总。
   */
  async getSummary(customerId: string) {
    const items = await this.findMine(customerId);
    const selectedItems = items.filter((item) => item.selected);
    const totalQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = selectedItems.reduce(
      (sum, item) => sum + Number(item.sku.price) * item.quantity,
      0,
    );

    return {
      totalQuantity,
      totalAmount: Number(totalAmount.toFixed(2)),
      discountAmount: 0,
      payableAmount: Number(totalAmount.toFixed(2)),
      selectedSkuIds: selectedItems.map((item) => item.skuId),
    };
  }

  /**
   * 新增或替换用户购物车中的 SKU 数量。
   */
  async upsert(customerId: string, dto: UpsertCartItemDto) {
    if (dto.quantity < 1) {
      throw new BusinessException(ErrorCode.VALIDATION_FAILED, "数量必须大于 0");
    }

    const sku = await this.prisma.sku.findUnique({
      where: { id: dto.skuId },
    });
    if (!sku || !sku.enabled) {
      throw new BusinessException(ErrorCode.NOT_FOUND, "SKU 不存在", HttpStatus.NOT_FOUND);
    }
    if (sku.stock - sku.lockedStock < dto.quantity) {
      throw new BusinessException(ErrorCode.INSUFFICIENT_STOCK, "库存不足");
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
        selected: true,
      },
      create: {
        customerId,
        skuId: dto.skuId,
        quantity: dto.quantity,
        selected: true,
      },
    });
  }

  /**
   * 修改单个购物车商品的选中状态。
   */
  updateSelected(customerId: string, skuId: string, dto: UpdateCartItemSelectedDto) {
    return this.prisma.cartItem.update({
      where: {
        customerId_skuId: {
          customerId,
          skuId,
        },
      },
      data: {
        selected: dto.selected,
      },
    });
  }

  /**
   * 批量修改当前用户购物车商品选中状态。
   */
  async updateAllSelected(customerId: string, selected: boolean) {
    await this.prisma.cartItem.updateMany({
      where: { customerId },
      data: { selected },
    });
    return this.findMine(customerId);
  }

  /**
   * 从用户购物车中移除一个 SKU。
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
