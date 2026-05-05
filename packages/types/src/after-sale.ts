export type AfterSaleType = "REFUND_ONLY" | "RETURN_REFUND";

export type AfterSaleStatus = "PENDING" | "APPROVED" | "REJECTED" | "REFUNDED" | "CANCELLED";

export interface AfterSaleItem {
  id: string;
  afterSaleId: string;
  orderItemId: string;
  quantity: number;
  refundAmount: number;
}

export interface AfterSale {
  id: string;
  afterSaleNo: string;
  customerId: string;
  orderId: string;
  type: AfterSaleType;
  status: AfterSaleStatus;
  reason: string;
  description?: string | null;
  refundAmount: number;
  rejectReason?: string | null;
  items: AfterSaleItem[];
  createdAt: string;
}
