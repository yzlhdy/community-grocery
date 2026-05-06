import { Module } from "@nestjs/common";
import { AdminOperationLogModule } from "../admin-operation-log/admin-operation-log.module";
import { AdminCategoryController } from "./admin-category.controller";
import { CategoryController } from "./category.controller";
import { CategoryRepository } from "./category.repository";
import { CategoryService } from "./category.service";

@Module({
  imports: [AdminOperationLogModule],
  controllers: [CategoryController, AdminCategoryController],
  providers: [CategoryService, CategoryRepository],
})
/**
 * 商品分类模块。
 */
export class CategoryModule {}
