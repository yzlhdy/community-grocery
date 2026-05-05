import { Injectable } from "@nestjs/common";
import { ErrorCode } from "../../common/exceptions/error-code.enum";
import { BusinessException } from "../../common/exceptions/business.exception";
import { Prisma } from "../../generated/prisma/client";

/**
 * Provides atomic stock lock, release, and confirmation operations.
 */
@Injectable()
export class InventoryService {
  /**
   * Locks sellable stock for a SKU inside an existing transaction.
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
        `Insufficient stock: ${productName}`,
      );
    }
  }

  /**
   * Releases previously locked stock after unpaid order cancellation.
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
   * Confirms payment by deducting physical stock and locked stock together.
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
