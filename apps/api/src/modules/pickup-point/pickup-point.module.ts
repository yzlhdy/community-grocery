import { Module } from "@nestjs/common";
import { AdminOperationLogModule } from "../admin-operation-log/admin-operation-log.module";
import { AdminPickupPointController } from "./admin-pickup-point.controller";
import { PickupPointController } from "./pickup-point.controller";
import { PickupPointRepository } from "./pickup-point.repository";
import { PickupPointService } from "./pickup-point.service";

@Module({
  imports: [AdminOperationLogModule],
  controllers: [PickupPointController, AdminPickupPointController],
  providers: [PickupPointService, PickupPointRepository],
})
/**
 * 自提点模块。
 */
export class PickupPointModule {}
