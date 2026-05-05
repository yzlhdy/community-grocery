import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtRoleGuard } from "../../common/guards/jwt-role.guard";
import { CreatePickupPointDto } from "./dto/create-pickup-point.dto";
import { PickupPointQueryDto } from "./dto/pickup-point-query.dto";
import { UpdatePickupPointDto } from "./dto/update-pickup-point.dto";
import { PickupPointService } from "./pickup-point.service";

@ApiTags("自提点")
@Controller("pickup-points")
/**
 * 自提点选择和后台管理接口。
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

  @Get("admin/page")
  @ApiBearerAuth()
  @ApiOperation({ summary: "后台分页查询自提点" })
  @UseGuards(JwtRoleGuard("admin"))
  /**
   * 后台分页查询自提点。
   */
  findPage(@Query() query: PickupPointQueryDto) {
    return this.pickupPointService.findPage(query);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: "创建自提点" })
  @UseGuards(JwtRoleGuard("admin"))
  /**
   * 创建自提点，需要后台管理员登录。
   */
  create(@Body() dto: CreatePickupPointDto) {
    return this.pickupPointService.create(dto);
  }

  @Patch(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "更新自提点" })
  @UseGuards(JwtRoleGuard("admin"))
  /**
   * 更新自提点，需要后台管理员登录。
   */
  update(@Param("id") id: string, @Body() dto: UpdatePickupPointDto) {
    return this.pickupPointService.update(id, dto);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "删除自提点" })
  @UseGuards(JwtRoleGuard("admin"))
  /**
   * 删除自提点，需要后台管理员登录。
   */
  delete(@Param("id") id: string) {
    return this.pickupPointService.delete(id);
  }
}
