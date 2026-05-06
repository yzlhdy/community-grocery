import { Injectable } from "@nestjs/common";
import { Prisma } from "../../generated/prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";
import { resolvePagination } from "../../common/utils/pagination";
import { CategoryQueryDto } from "./dto/category-query.dto";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

/**
 * 分类数据访问层。
 */
@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 查询分类树原始列表。
   */
  findTreeList() {
    return this.prisma.category.findMany({
      where: { deletedAt: null, enabled: true },
      orderBy: [{ level: "asc" }, { sort: "asc" }],
    });
  }

  /**
   * 分页查询分类。
   */
  async findPage(query: CategoryQueryDto) {
    const pagination = resolvePagination(query);
    const where = {
      deletedAt: null,
      enabled: query.enabled === undefined ? undefined : query.enabled === "true",
      name: query.keyword ? { contains: query.keyword, mode: "insensitive" as const } : undefined,
    };
    const [list, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        orderBy: [{ level: "asc" }, { sort: "asc" }],
        skip: pagination.skip,
        take: pagination.take,
      }),
      this.prisma.category.count({ where }),
    ]);

    return { list, total, ...pagination };
  }

  /**
   * 创建分类。
   */
  create(dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: this.toCreateData(dto),
    });
  }

  /**
   * 更新分类。
   */
  update(id: string, dto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data: this.toUpdateData(dto),
    });
  }

  /**
   * 删除分类。
   */
  delete(id: string) {
    return this.prisma.category.update({
      where: { id },
      data: {
        enabled: false,
        deletedAt: new Date(),
      },
    });
  }

  /**
   * 将 DTO 转换为 Prisma 写入结构。
   */
  private toCreateData(dto: CreateCategoryDto): Prisma.CategoryUncheckedCreateInput {
    return this.toData(dto) as Prisma.CategoryUncheckedCreateInput;
  }

  /**
   * 将更新 DTO 转换为 Prisma 写入结构。
   */
  private toUpdateData(dto: UpdateCategoryDto): Prisma.CategoryUncheckedUpdateInput {
    return this.toData(dto);
  }

  /**
   * 将 DTO 转换为基础写入结构。
   */
  private toData(dto: CreateCategoryDto | UpdateCategoryDto): Prisma.CategoryUncheckedUpdateInput {
    return {
      name: dto.name,
      parentId: dto.parentId ?? undefined,
      level: dto.level,
      iconUrl: dto.iconUrl,
      sort: dto.sort,
      enabled: dto.enabled,
    };
  }
}
