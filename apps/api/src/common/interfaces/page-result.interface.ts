/**
 * 标准分页返回结构。
 */
export interface PageResult<T> {
  /** 当前页数据。 */
  list: T[];
  /** 总数据量。 */
  total: number;
  /** 当前页码。 */
  page: number;
  /** 每页数量。 */
  pageSize: number;
  /** 总页数。 */
  totalPages: number;
  /** 是否还有下一页。 */
  hasNext: boolean;
  /** 是否存在上一页。 */
  hasPrev: boolean;
}
