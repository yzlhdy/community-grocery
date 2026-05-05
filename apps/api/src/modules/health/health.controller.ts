import { Controller, Get } from "@nestjs/common";

@Controller("health")
/**
 * Health check endpoint for infrastructure and deployment probes.
 */
export class HealthController {
  /**
   * Returns basic API liveness information.
   */
  @Get()
  getHealth() {
    return {
      status: "ok",
      service: "community-grocery-api",
    };
  }
}
