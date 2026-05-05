import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtRoleGuard } from "../../common/guards/jwt-role.guard";
import { ProductQueryDto } from "./dto/product-query.dto";
import { UpsertProductDto } from "./dto/upsert-product.dto";
import { ProductService } from "./product.service";

@ApiTags("products")
@Controller("products")
/**
 * Product endpoints for browsing and admin management.
 */
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  /**
   * Lists products by optional category and keyword filters.
   */
  findMany(@Query() query: ProductQueryDto) {
    return this.productService.findMany(query);
  }

  @Get(":id")
  /**
   * Reads a single product detail.
   */
  findOne(@Param("id") id: string) {
    return this.productService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtRoleGuard("admin"))
  /**
   * Creates or updates a product. Requires admin authentication.
   */
  upsert(@Body() dto: UpsertProductDto) {
    return this.productService.upsert(dto);
  }
}
