import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import type { Request } from "express";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtRoleGuard } from "../../common/guards/jwt-role.guard";
import type { AuthUser } from "../../common/types/authenticated-request";
import { getRequestMeta } from "../../common/utils/request-meta";
import { AdminOperationLogService } from "../admin-operation-log/admin-operation-log.service";
import { CommunityService } from "./community.service";
import { CommunityQueryDto } from "./dto/community-query.dto";
import { CreateCommunityDto } from "./dto/create-community.dto";
import { UpdateCommunityDto } from "./dto/update-community.dto";

@ApiTags("后台-小区")
@ApiBearerAuth()
@UseGuards(JwtRoleGuard("admin"))
@Controller("admin/communities")
/**
 * 后台小区管理接口。
 */
export class AdminCommunityController {
  constructor(
    private readonly communityService: CommunityService,
    private readonly auditLogService: AdminOperationLogService,
  ) {}

  @Get()
  @ApiOperation({ summary: "后台分页查询小区" })
  /**
   * 后台分页查询小区。
   */
  findPage(@Query() query: CommunityQueryDto) {
    return this.communityService.findPage(query);
  }

  @Post()
  @ApiOperation({ summary: "创建小区" })
  /**
   * 创建小区并记录后台审计日志。
   */
  async create(@CurrentUser() user: AuthUser, @Req() request: Request, @Body() dto: CreateCommunityDto) {
    const community = await this.communityService.create(dto);
    await this.auditLogService.write({
      adminUserId: user.sub,
      module: "community",
      action: "create",
      resourceId: community.id,
      summary: `创建小区：${community.name}`,
      afterData: community,
      ...getRequestMeta(request),
    });
    return community;
  }

  @Patch(":id")
  @ApiOperation({ summary: "更新小区" })
  /**
   * 更新小区并记录后台审计日志。
   */
  async update(
    @CurrentUser() user: AuthUser,
    @Req() request: Request,
    @Param("id") id: string,
    @Body() dto: UpdateCommunityDto,
  ) {
    const community = await this.communityService.update(id, dto);
    await this.auditLogService.write({
      adminUserId: user.sub,
      module: "community",
      action: "update",
      resourceId: community.id,
      summary: `更新小区：${community.name}`,
      afterData: community,
      ...getRequestMeta(request),
    });
    return community;
  }

  @Delete(":id")
  @ApiOperation({ summary: "删除小区" })
  /**
   * 软删除小区并记录后台审计日志。
   */
  async delete(@CurrentUser() user: AuthUser, @Req() request: Request, @Param("id") id: string) {
    const community = await this.communityService.delete(id);
    await this.auditLogService.write({
      adminUserId: user.sub,
      module: "community",
      action: "delete",
      resourceId: community.id,
      summary: `删除小区：${community.name}`,
      afterData: community,
      ...getRequestMeta(request),
    });
    return community;
  }
}
