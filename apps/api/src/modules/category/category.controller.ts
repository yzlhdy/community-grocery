import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtRoleGuard } from "../../common/guards/jwt-role.guard";
import { CategoryService } from "./category.service";
import { CategoryQueryDto } from "./dto/category-query.dto";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@ApiTags("分类")
@Controller("categories")
/**
 * 商品分类查询和后台管理接口。
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

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: "后台分页查询分类" })
  @UseGuards(JwtRoleGuard("admin"))
  /**
   * 后台分页查询分类。
   */
  findPage(@Query() query: CategoryQueryDto) {
    return this.categoryService.findPage(query);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: "创建分类" })
  @UseGuards(JwtRoleGuard("admin"))
  /**
   * 创建分类，需要后台管理员登录。
   */
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  @Patch(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "更新分类" })
  @UseGuards(JwtRoleGuard("admin"))
  /**
   * 更新分类，需要后台管理员登录。
   */
  update(@Param("id") id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoryService.update(id, dto);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "删除分类" })
  @UseGuards(JwtRoleGuard("admin"))
  /**
   * 删除分类，需要后台管理员登录。
   */
  delete(@Param("id") id: string) {
    return this.categoryService.delete(id);
  }
}
