import { Module } from "@nestjs/common";
import { PickupPointController } from "./pickup-point.controller";
import { PickupPointService } from "./pickup-point.service";

@Module({
  controllers: [PickupPointController],
  providers: [PickupPointService],
})
/**
 * Pickup point module.
 */
export class PickupPointModule {}
