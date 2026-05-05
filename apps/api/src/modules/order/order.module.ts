import { Module } from "@nestjs/common";
import { InventoryModule } from "../inventory/inventory.module";
import { NotificationModule } from "../notification/notification.module";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";

@Module({
  imports: [InventoryModule, NotificationModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
/**
 * 订单模块。
 */
export class OrderModule {}
