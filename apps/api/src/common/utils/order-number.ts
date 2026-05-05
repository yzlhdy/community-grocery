/**
 * Creates a readable unique order number.
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
 * Creates a payment number derived from the same timestamp strategy as orders.
 */
export function createPaymentNo() {
  return `PAY${createOrderNo().slice(2)}`;
}

/**
 * Creates a short pickup code for offline self-pickup verification.
 */
export function createPickupCode() {
  return Math.random().toString().slice(2, 6).padEnd(4, "0");
}
