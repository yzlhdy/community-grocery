export const ORDER_STATUS_LABEL = {
  PENDING_PAYMENT: "待支付",
  PENDING_PICKUP: "待自提",
  COMPLETED: "已完成",
  CANCELLED: "已取消",
  REFUNDING: "退款中",
  REFUNDED: "已退款",
} as const;

export const PAYMENT_STATUS_LABEL = {
  PENDING: "待支付",
  PAID: "已支付",
  FAILED: "支付失败",
  CLOSED: "已关闭",
  REFUNDED: "已退款",
} as const;

export const PRODUCT_CATEGORY_LEVEL = {
  primary: 1,
  secondary: 2,
  tertiary: 3,
} as const;

export const CUSTOMER_COUPON_STATUS_LABEL = {
  AVAILABLE: "可使用",
  USED: "已使用",
  EXPIRED: "已过期",
} as const;

export const PROMOTION_TYPE_LABEL = {
  SECKILL: "秒杀",
  RECOMMEND: "推荐",
} as const;

export const AFTER_SALE_STATUS_LABEL = {
  PENDING: "待审核",
  APPROVED: "已通过",
  REJECTED: "已拒绝",
  REFUNDED: "已退款",
  CANCELLED: "已取消",
} as const;

export const AFTER_SALE_TYPE_LABEL = {
  REFUND_ONLY: "仅退款",
  RETURN_REFUND: "退货退款",
} as const;

export const NOTIFICATION_TYPE_LABEL = {
  ORDER: "订单通知",
  PAYMENT: "支付通知",
  AFTER_SALE: "售后通知",
  SYSTEM: "系统通知",
} as const;
