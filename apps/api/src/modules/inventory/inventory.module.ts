import { Module } from "@nestjs/common";
import { InventoryService } from "./inventory.service";

@Module({
  providers: [InventoryService],
  exports: [InventoryService],
})
/**
 * Inventory domain module for SKU stock locking and settlement.
 */
export class InventoryModule {}
