import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";

@Module({
  controllers: [HealthController],
})
/**
 * 健康检查模块。
 */
export class HealthModule {}
