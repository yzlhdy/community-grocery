import type { ErrorCode } from "../exceptions/error-code.enum";

/**
 * HTTP 请求失败时返回的标准响应结构。
 */
export interface ApiErrorResponse {
  /** 请求是否成功。 */
  success: false;
  /** 稳定、机器可读的错误码。 */
  code: ErrorCode | string;
  /** HTTP 状态码。 */
  statusCode: number;
  /** 面向人的错误信息。 */
  message: string | string[];
  /** 可选结构化错误详情。 */
  details?: unknown;
  /** API 网关层生成的 ISO 时间戳。 */
  timestamp: string;
  /** 产生错误的请求路径。 */
  path: string;
}
