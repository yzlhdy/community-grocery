import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtRoleGuard } from "../../common/guards/jwt-role.guard";
import { CreateProductDto } from "./dto/create-product.dto";
import { ProductQueryDto } from "./dto/product-query.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductService } from "./product.service";

@ApiTags("商品")
@Controller("products")
/**
 * 商品浏览和后台管理接口。
 */
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: "分页查询商品列表" })
  /**
   * 按分类、关键词和上下架状态查询商品。
   */
  findMany(@Query() query: ProductQueryDto) {
    return this.productService.findMany(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "查询商品详情" })
  /**
   * 查询单个商品详情。
   */
  findOne(@Param("id") id: string) {
    return this.productService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: "创建商品" })
  @UseGuards(JwtRoleGuard("admin"))
  /**
   * 创建商品及 SKU，需要后台管理员登录。
   */
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Patch(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "更新商品" })
  @UseGuards(JwtRoleGuard("admin"))
  /**
   * 更新商品及 SKU，需要后台管理员登录。
   */
  update(@Param("id") id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, dto);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "删除商品" })
  @UseGuards(JwtRoleGuard("admin"))
  /**
   * 删除商品，需要后台管理员登录。
   */
  delete(@Param("id") id: string) {
    return this.productService.delete(id);
  }
}
