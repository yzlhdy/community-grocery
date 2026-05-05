export type PointsChangeType = "ORDER_REWARD" | "REFUND_DEDUCT" | "MANUAL_ADJUST";

export interface PointsLedger {
  id: string;
  customerId: string;
  type: PointsChangeType;
  points: number;
  balance: number;
  description: string;
  orderId?: string | null;
  createdAt: string;
}
