import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { PickupPointService } from "./pickup-point.service";

@ApiTags("自提点")
@Controller("pickup-points")
/**
 * 自提点公开选择接口。
 */
export class PickupPointController {
  constructor(private readonly pickupPointService: PickupPointService) {}

  @Get()
  @ApiOperation({ summary: "查询小区自提点" })
  /**
   * 查询指定小区下的可用自提点。
   */
  findByCommunity(@Query("communityId") communityId: string) {
    return this.pickupPointService.findByCommunity(communityId);
  }

}
