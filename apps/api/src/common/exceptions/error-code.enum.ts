/**
 * API 返回的稳定业务错误码。
 */
export enum ErrorCode {
  /** 未知服务端异常。 */
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  /** 请求体或查询参数不合法。 */
  VALIDATION_FAILED = "VALIDATION_FAILED",
  /** 认证令牌缺失或无效。 */
  UNAUTHORIZED = "UNAUTHORIZED",
  /** 当前用户无权访问资源。 */
  FORBIDDEN = "FORBIDDEN",
  /** 请求资源不存在。 */
  NOT_FOUND = "NOT_FOUND",
  /** 通用业务规则错误。 */
  BUSINESS_ERROR = "BUSINESS_ERROR",
  /** SKU 库存不足。 */
  INSUFFICIENT_STOCK = "INSUFFICIENT_STOCK",
  /** 订单状态不允许当前操作。 */
  INVALID_ORDER_STATUS = "INVALID_ORDER_STATUS",
  /** 自提点已停用或不属于所选小区。 */
  INVALID_PICKUP_POINT = "INVALID_PICKUP_POINT",
  /** 支付回调已处理。 */
  PAYMENT_DUPLICATED = "PAYMENT_DUPLICATED",
}
