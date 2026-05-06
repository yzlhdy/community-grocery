import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ProductQueryDto } from "./dto/product-query.dto";
import { ProductService } from "./product.service";

@ApiTags("商品")
@Controller("products")
/**
 * 商品公开浏览接口。
 */
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: "分页查询商品列表" })
  /**
   * 按分类、关键词和上下架状态查询商品。
   */
  findMany(@Query() query: ProductQueryDto) {
    return this.productService.findMany({ ...query, enabled: query.enabled ?? "true" });
  }

  @Get(":id")
  @ApiOperation({ summary: "查询商品详情" })
  /**
   * 查询单个商品详情。
   */
  findOne(@Param("id") id: string) {
    return this.productService.findOne(id, { enabled: true });
  }

}
