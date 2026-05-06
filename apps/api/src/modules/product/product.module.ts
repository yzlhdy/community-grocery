import { Module } from "@nestjs/common";
import { AdminOperationLogModule } from "../admin-operation-log/admin-operation-log.module";
import { AdminProductController } from "./admin-product.controller";
import { ProductController } from "./product.controller";
import { ProductRepository } from "./product.repository";
import { ProductService } from "./product.service";

@Module({
  imports: [AdminOperationLogModule],
  controllers: [ProductController, AdminProductController],
  providers: [ProductService, ProductRepository],
})
/**
 * 商品和 SKU 模块。
 */
export class ProductModule {}
