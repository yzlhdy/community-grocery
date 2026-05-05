import { Module } from "@nestjs/common";
import { InventoryService } from "./inventory.service";

@Module({
  providers: [InventoryService],
  exports: [InventoryService],
})
/**
 * 库存领域模块，负责 SKU 库存锁定和结算。
 */
export class InventoryModule {}
