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
