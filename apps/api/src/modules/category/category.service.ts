import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { UpsertCategoryDto } from "./dto/upsert-category.dto";

@Injectable()
/**
 * Provides category tree query and admin upsert operations.
 */
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns enabled and disabled categories in a two-level tree structure.
   */
  async findTree() {
    const categories = await this.prisma.category.findMany({
      orderBy: [{ level: "asc" }, { sort: "asc" }],
    });

    return categories
      .filter((category) => !category.parentId)
      .map((category) => ({
        ...category,
        children: categories.filter((item) => item.parentId === category.id),
      }));
  }

  /**
   * Creates or updates a category record.
   */
  upsert(dto: UpsertCategoryDto) {
    const data = {
      name: dto.name,
      parentId: dto.parentId ?? null,
      level: dto.level,
      iconUrl: dto.iconUrl,
      sort: dto.sort ?? 0,
      enabled: dto.enabled ?? true,
    };

    if (dto.id) {
      return this.prisma.category.update({
        where: { id: dto.id },
        data,
      });
    }

    return this.prisma.category.create({ data });
  }
}
