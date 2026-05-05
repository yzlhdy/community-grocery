import { Module } from "@nestjs/common";
import { PointsController } from "./points.controller";
import { PointsService } from "./points.service";

@Module({
  controllers: [PointsController],
  providers: [PointsService],
  exports: [PointsService],
})
/**
 * 积分模块，负责积分流水和余额变更。
 */
export class PointsModule {}
