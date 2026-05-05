/**
 * 创建可读的唯一订单号。
 */
export function createOrderNo() {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:TZ.]/g, "")
    .slice(0, 14);
  const suffix = Math.random().toString().slice(2, 8);
  return `CG${timestamp}${suffix}`;
}

/**
 * 使用与订单号一致的时间戳策略创建支付单号。
 */
export function createPaymentNo() {
  return `PAY${createOrderNo().slice(2)}`;
}

/**
 * 创建用于线下自提核销的短自提码。
 */
export function createPickupCode() {
  return Math.random().toString().slice(2, 6).padEnd(4, "0");
}

/**
 * 创建售后单号。
 */
export function createAfterSaleNo() {
  return `AS${createOrderNo().slice(2)}`;
}
