export function formatPrice(value: number) {
  return `¥${value.toFixed(2)}`;
}

export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${String(value)}`);
}
