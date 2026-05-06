import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CategoryService } from "./category.service";

@ApiTags("分类")
@Controller("categories")
/**
 * 商品分类公开查询接口。
 */
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get("tree")
  @ApiOperation({ summary: "查询分类树" })
  /**
   * 查询商品浏览页使用的分类树。
   */
  findTree() {
    return this.categoryService.findTree();
  }

}
