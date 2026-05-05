import { PageQueryDto } from "../dto/page-query.dto";
import type { PageResult } from "../interfaces/page-result.interface";

/**
 * 解析分页参数为 Prisma 可用的 skip/take。
 */
export function resolvePagination(query: PageQueryDto) {
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 20;
  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    take: pageSize,
  };
}

/**
 * 创建标准分页返回结构。
 */
export function createPageResult<T>(input: {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}): PageResult<T> {
  const totalPages = Math.ceil(input.total / input.pageSize);
  return {
    ...input,
    totalPages,
    hasNext: input.page < totalPages,
    hasPrev: input.page > 1,
  };
}
