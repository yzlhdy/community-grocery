import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import type { Request } from "express";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtRoleGuard } from "../../common/guards/jwt-role.guard";
import type { AuthUser } from "../../common/types/authenticated-request";
import { getRequestMeta } from "../../common/utils/request-meta";
import { AdminOperationLogService } from "../admin-operation-log/admin-operation-log.service";
import { CategoryService } from "./category.service";
import { CategoryQueryDto } from "./dto/category-query.dto";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@ApiTags("后台-分类")
@ApiBearerAuth()
@UseGuards(JwtRoleGuard("admin"))
@Controller("admin/categories")
/**
 * 后台分类管理接口。
 */
export class AdminCategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly auditLogService: AdminOperationLogService,
  ) {}

  @Get()
  @ApiOperation({ summary: "后台分页查询分类" })
  /**
   * 后台分页查询分类。
   */
  findPage(@Query() query: CategoryQueryDto) {
    return this.categoryService.findPage(query);
  }

  @Post()
  @ApiOperation({ summary: "创建分类" })
  /**
   * 创建分类并记录后台审计日志。
   */
  async create(@CurrentUser() user: AuthUser, @Req() request: Request, @Body() dto: CreateCategoryDto) {
    const category = await this.categoryService.create(dto);
    await this.auditLogService.write({
      adminUserId: user.sub,
      module: "category",
      action: "create",
      resourceId: category.id,
      summary: `创建分类：${category.name}`,
      afterData: category,
      ...getRequestMeta(request),
    });
    return category;
  }

  @Patch(":id")
  @ApiOperation({ summary: "更新分类" })
  /**
   * 更新分类并记录后台审计日志。
   */
  async update(
    @CurrentUser() user: AuthUser,
    @Req() request: Request,
    @Param("id") id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    const category = await this.categoryService.update(id, dto);
    await this.auditLogService.write({
      adminUserId: user.sub,
      module: "category",
      action: "update",
      resourceId: category.id,
      summary: `更新分类：${category.name}`,
      afterData: category,
      ...getRequestMeta(request),
    });
    return category;
  }

  @Delete(":id")
  @ApiOperation({ summary: "删除分类" })
  /**
   * 软删除分类并记录后台审计日志。
   */
  async delete(@CurrentUser() user: AuthUser, @Req() request: Request, @Param("id") id: string) {
    const category = await this.categoryService.delete(id);
    await this.auditLogService.write({
      adminUserId: user.sub,
      module: "category",
      action: "delete",
      resourceId: category.id,
      summary: `删除分类：${category.name}`,
      afterData: category,
      ...getRequestMeta(request),
    });
    return category;
  }
}
