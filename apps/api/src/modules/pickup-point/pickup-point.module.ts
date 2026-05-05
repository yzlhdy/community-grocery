import { Module } from "@nestjs/common";
import { PickupPointController } from "./pickup-point.controller";
import { PickupPointRepository } from "./pickup-point.repository";
import { PickupPointService } from "./pickup-point.service";

@Module({
  controllers: [PickupPointController],
  providers: [PickupPointService, PickupPointRepository],
})
/**
 * 自提点模块。
 */
export class PickupPointModule {}
