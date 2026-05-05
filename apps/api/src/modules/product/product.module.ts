import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductRepository } from "./product.repository";
import { ProductService } from "./product.service";

@Module({
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
})
/**
 * 商品和 SKU 模块。
 */
export class ProductModule {}
