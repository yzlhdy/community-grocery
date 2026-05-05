/**
 * Stable business error codes returned by the API.
 */
export enum ErrorCode {
  /** Unknown server-side failure. */
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  /** Request payload or query parameters are invalid. */
  VALIDATION_FAILED = "VALIDATION_FAILED",
  /** Authentication token is missing or invalid. */
  UNAUTHORIZED = "UNAUTHORIZED",
  /** Current user is not allowed to access the resource. */
  FORBIDDEN = "FORBIDDEN",
  /** Requested resource does not exist. */
  NOT_FOUND = "NOT_FOUND",
  /** Generic business rule violation. */
  BUSINESS_ERROR = "BUSINESS_ERROR",
  /** SKU stock cannot satisfy the requested quantity. */
  INSUFFICIENT_STOCK = "INSUFFICIENT_STOCK",
  /** Order state does not allow the requested transition. */
  INVALID_ORDER_STATUS = "INVALID_ORDER_STATUS",
  /** Pickup point is disabled or not part of the selected community. */
  INVALID_PICKUP_POINT = "INVALID_PICKUP_POINT",
  /** Payment callback has already been processed. */
  PAYMENT_DUPLICATED = "PAYMENT_DUPLICATED",
}
