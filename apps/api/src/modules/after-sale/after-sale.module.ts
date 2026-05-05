import { Module } from "@nestjs/common";
import { NotificationModule } from "../notification/notification.module";
import { PointsModule } from "../points/points.module";
import { AfterSaleController } from "./after-sale.controller";
import { AfterSaleService } from "./after-sale.service";

@Module({
  imports: [NotificationModule, PointsModule],
  controllers: [AfterSaleController],
  providers: [AfterSaleService],
  exports: [AfterSaleService],
})
/**
 * 售后模块，负责退款申请、审核和退款确认。
 */
export class AfterSaleModule {}
