import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";

@Module({
  controllers: [HealthController],
})
/**
 * Health check module.
 */
export class HealthModule {}
