import type { Category } from "../../generated/prisma/client";

/**
 * 将分类数据库对象转换为接口响应对象。
 */
export function presentCategory(category: Category) {
  return {
    id: category.id,
    name: category.name,
    parentId: category.parentId,
    level: category.level,
    iconUrl: category.iconUrl,
    sort: category.sort,
    enabled: category.enabled,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}
