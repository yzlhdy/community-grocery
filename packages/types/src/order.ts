export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PENDING_PICKUP"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDING"
  | "REFUNDED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "CLOSED" | "REFUNDED";

export interface OrderItem {
  id: string;
  skuId: string;
  productName: string;
  skuName: string;
  imageUrl: string;
  price: number;
  quantity: number;
  unit: string;
}

export interface Order {
  id: string;
  orderNo: string;
  customerId: string;
  communityId: string;
  pickupPointId: string;
  status: OrderStatus;
  pickupCode?: string;
  totalAmount: number;
  discountAmount: number;
  payableAmount: number;
  items: OrderItem[];
  createdAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  paymentNo: string;
  provider: "wechat";
  providerTxnId?: string;
  status: PaymentStatus;
  amount: number;
  paidAt?: string;
  createdAt: string;
}
