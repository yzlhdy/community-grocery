import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import type { Request } from "express";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtRoleGuard } from "../../common/guards/jwt-role.guard";
import type { AuthUser } from "../../common/types/authenticated-request";
import { getRequestMeta } from "../../common/utils/request-meta";
import { AdminOperationLogService } from "../admin-operation-log/admin-operation-log.service";
import { CreatePickupPointDto } from "./dto/create-pickup-point.dto";
import { PickupPointQueryDto } from "./dto/pickup-point-query.dto";
import { UpdatePickupPointDto } from "./dto/update-pickup-point.dto";
import { PickupPointService } from "./pickup-point.service";

@ApiTags("后台-自提点")
@ApiBearerAuth()
@UseGuards(JwtRoleGuard("admin"))
@Controller("admin/pickup-points")
/**
 * 后台自提点管理接口。
 */
export class AdminPickupPointController {
  constructor(
    private readonly pickupPointService: PickupPointService,
    private readonly auditLogService: AdminOperationLogService,
  ) {}

  @Get()
  @ApiOperation({ summary: "后台分页查询自提点" })
  /**
   * 后台分页查询自提点。
   */
  findPage(@Query() query: PickupPointQueryDto) {
    return this.pickupPointService.findPage(query);
  }

  @Post()
  @ApiOperation({ summary: "创建自提点" })
  /**
   * 创建自提点并记录后台审计日志。
   */
  async create(@CurrentUser() user: AuthUser, @Req() request: Request, @Body() dto: CreatePickupPointDto) {
    const pickupPoint = await this.pickupPointService.create(dto);
    await this.auditLogService.write({
      adminUserId: user.sub,
      module: "pickup-point",
      action: "create",
      resourceId: pickupPoint.id,
      summary: `创建自提点：${pickupPoint.name}`,
      afterData: pickupPoint,
      ...getRequestMeta(request),
    });
    return pickupPoint;
  }

  @Patch(":id")
  @ApiOperation({ summary: "更新自提点" })
  /**
   * 更新自提点并记录后台审计日志。
   */
  async update(
    @CurrentUser() user: AuthUser,
    @Req() request: Request,
    @Param("id") id: string,
    @Body() dto: UpdatePickupPointDto,
  ) {
    const pickupPoint = await this.pickupPointService.update(id, dto);
    await this.auditLogService.write({
      adminUserId: user.sub,
      module: "pickup-point",
      action: "update",
      resourceId: pickupPoint.id,
      summary: `更新自提点：${pickupPoint.name}`,
      afterData: pickupPoint,
      ...getRequestMeta(request),
    });
    return pickupPoint;
  }

  @Delete(":id")
  @ApiOperation({ summary: "删除自提点" })
  /**
   * 软删除自提点并记录后台审计日志。
   */
  async delete(@CurrentUser() user: AuthUser, @Req() request: Request, @Param("id") id: string) {
    const pickupPoint = await this.pickupPointService.delete(id);
    await this.auditLogService.write({
      adminUserId: user.sub,
      module: "pickup-point",
      action: "delete",
      resourceId: pickupPoint.id,
      summary: `删除自提点：${pickupPoint.name}`,
      afterData: pickupPoint,
      ...getRequestMeta(request),
    });
    return pickupPoint;
  }
}
