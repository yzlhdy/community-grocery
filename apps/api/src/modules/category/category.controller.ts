import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtRoleGuard } from "../../common/guards/jwt-role.guard";
import { CategoryService } from "./category.service";
import { UpsertCategoryDto } from "./dto/upsert-category.dto";

@ApiTags("categories")
@Controller("categories")
/**
 * Category endpoints for clients and admin management.
 */
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get("tree")
  /**
   * Reads the category tree used by product browsing pages.
   */
  findTree() {
    return this.categoryService.findTree();
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtRoleGuard("admin"))
  /**
   * Creates or updates a category. Requires admin authentication.
   */
  upsert(@Body() dto: UpsertCategoryDto) {
    return this.categoryService.upsert(dto);
  }
}
