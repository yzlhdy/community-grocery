import { Injectable } from "@nestjs/common";
import { ErrorCode } from "../../common/exceptions/error-code.enum";
import { BusinessException } from "../../common/exceptions/business.exception";
import { Prisma } from "../../generated/prisma/client";

/**
 * 提供原子化库存锁定、释放和确认扣减能力。
 */
@Injectable()
export class InventoryService {
  /**
   * 在现有事务内锁定 SKU 可售库存。
   */
  async lockSkuStock(
    tx: Prisma.TransactionClient,
    skuId: string,
    quantity: number,
    productName: string,
    currentLockedStock: number,
  ) {
    const locked = await tx.sku.updateMany({
      where: {
        id: skuId,
        stock: { gte: currentLockedStock + quantity },
        lockedStock: currentLockedStock,
      },
      data: {
        lockedStock: { increment: quantity },
      },
    });

    if (locked.count !== 1) {
      throw new BusinessException(
        ErrorCode.INSUFFICIENT_STOCK,
        `库存不足：${productName}`,
      );
    }
  }

  /**
   * 未支付订单取消后释放已锁定库存。
   */
  async releaseLockedStock(tx: Prisma.TransactionClient, skuId: string, quantity: number) {
    await tx.sku.update({
      where: { id: skuId },
      data: {
        lockedStock: { decrement: quantity },
      },
    });
  }

  /**
   * 支付确认后同时扣减实际库存和锁定库存。
   */
  async confirmLockedStock(tx: Prisma.TransactionClient, skuId: string, quantity: number) {
    await tx.sku.update({
      where: { id: skuId },
      data: {
        stock: { decrement: quantity },
        lockedStock: { decrement: quantity },
      },
    });
  }
}
