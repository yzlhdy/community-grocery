import { Injectable } from "@nestjs/common";
import { createPageResult } from "../../common/utils/pagination";
import { CategoryRepository } from "./category.repository";
import { CategoryQueryDto } from "./dto/category-query.dto";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
/**
 * 提供分类树查询和后台分类写入能力。
 */
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  /**
   * 以树形结构返回分类列表。
   */
  async findTree() {
    const categories = await this.categoryRepository.findTreeList();

    return categories
      .filter((category) => !category.parentId)
      .map((category) => ({
        ...category,
        children: categories.filter((item) => item.parentId === category.id),
      }));
  }

  /**
   * 分页查询分类。
   */
  async findPage(query: CategoryQueryDto) {
    const page = await this.categoryRepository.findPage(query);
    return createPageResult(page);
  }

  /**
   * 创建分类记录。
   */
  create(dto: CreateCategoryDto) {
    return this.categoryRepository.create(dto);
  }

  /**
   * 更新分类记录。
   */
  update(id: string, dto: UpdateCategoryDto) {
    return this.categoryRepository.update(id, dto);
  }

  /**
   * 删除分类记录。
   */
  delete(id: string) {
    return this.categoryRepository.delete(id);
  }
}
