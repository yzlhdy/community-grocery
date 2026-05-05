import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtRoleGuard } from "../../common/guards/jwt-role.guard";
import { UpsertPickupPointDto } from "./dto/upsert-pickup-point.dto";
import { PickupPointService } from "./pickup-point.service";

@ApiTags("pickup-points")
@Controller("pickup-points")
/**
 * Pickup point endpoints for customer selection and admin management.
 */
export class PickupPointController {
  constructor(private readonly pickupPointService: PickupPointService) {}

  @Get()
  /**
   * Lists pickup points under a community.
   */
  findByCommunity(@Query("communityId") communityId: string) {
    return this.pickupPointService.findByCommunity(communityId);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtRoleGuard("admin"))
  /**
   * Creates or updates a pickup point. Requires admin authentication.
   */
  upsert(@Body() dto: UpsertPickupPointDto) {
    return this.pickupPointService.upsert(dto);
  }
}
