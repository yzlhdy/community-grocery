import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import type { Request } from "express";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtRoleGuard } from "../../common/guards/jwt-role.guard";
import type { AuthUser } from "../../common/types/authenticated-request";
import { getRequestMeta } from "../../common/utils/request-meta";
import { AdminOperationLogService } from "../admin-operation-log/admin-operation-log.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { ProductQueryDto } from "./dto/product-query.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductService } from "./product.service";

@ApiTags("后台-商品")
@ApiBearerAuth()
@UseGuards(JwtRoleGuard("admin"))
@Controller("admin/products")
/**
 * 后台商品管理接口。
 */
export class AdminProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly auditLogService: AdminOperationLogService,
  ) {}

  @Get()
  @ApiOperation({ summary: "后台分页查询商品" })
  /**
   * 后台按条件分页查询商品。
   */
  findPage(@Query() query: ProductQueryDto) {
    return this.productService.findMany(query);
  }

  @Post()
  @ApiOperation({ summary: "创建商品" })
  /**
   * 创建商品并记录后台审计日志。
   */
  async create(@CurrentUser() user: AuthUser, @Req() request: Request, @Body() dto: CreateProductDto) {
    const product = await this.productService.create(dto);
    await this.auditLogService.write({
      adminUserId: user.sub,
      module: "product",
      action: "create",
      resourceId: product.id,
      summary: `创建商品：${product.name}`,
      afterData: product,
      ...getRequestMeta(request),
    });
    return product;
  }

  @Patch(":id")
  @ApiOperation({ summary: "更新商品" })
  /**
   * 更新商品并记录后台审计日志。
   */
  async update(
    @CurrentUser() user: AuthUser,
    @Req() request: Request,
    @Param("id") id: string,
    @Body() dto: UpdateProductDto,
  ) {
    const product = await this.productService.update(id, dto);
    await this.auditLogService.write({
      adminUserId: user.sub,
      module: "product",
      action: "update",
      resourceId: product.id,
      summary: `更新商品：${product.name}`,
      afterData: product,
      ...getRequestMeta(request),
    });
    return product;
  }

  @Delete(":id")
  @ApiOperation({ summary: "删除商品" })
  /**
   * 软删除商品并记录后台审计日志。
   */
  async delete(@CurrentUser() user: AuthUser, @Req() request: Request, @Param("id") id: string) {
    const product = await this.productService.delete(id);
    await this.auditLogService.write({
      adminUserId: user.sub,
      module: "product",
      action: "delete",
      resourceId: product.id,
      summary: `删除商品：${product.name}`,
      afterData: product,
      ...getRequestMeta(request),
    });
    return product;
  }
}
