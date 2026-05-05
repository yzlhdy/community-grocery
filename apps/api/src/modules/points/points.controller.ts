import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { PageQueryDto } from "../../common/dto/page-query.dto";
import { JwtRoleGuard } from "../../common/guards/jwt-role.guard";
import type { AuthUser } from "../../common/types/authenticated-request";
import { PointsService } from "./points.service";

@ApiTags("积分")
@ApiBearerAuth()
@UseGuards(JwtRoleGuard("customer"))
@Controller("points")
/**
 * 小程序用户积分接口。
 */
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Get("mine")
  @ApiOperation({ summary: "查询我的积分流水" })
  /**
   * 查询当前登录用户积分流水。
   */
  findMine(@CurrentUser() user: AuthUser, @Query() query: PageQueryDto) {
    return this.pointsService.findMine(user.sub, query);
  }
}
