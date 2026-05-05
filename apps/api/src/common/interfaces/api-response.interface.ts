/**
 * HTTP 请求成功时返回的标准响应结构。
 *
 * 控制器只返回业务数据；全局响应拦截器会统一包装为该结构，
 * 确保所有客户端拿到稳定接口契约。
 */
export interface ApiResponse<T> {
  /** 请求是否成功。 */
  success: true;
  /** 成功响应数据。 */
  data: T;
  /** API 网关层生成的 ISO 时间戳。 */
  timestamp: string;
}
