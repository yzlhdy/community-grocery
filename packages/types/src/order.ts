export type OrderStatus =
  | "pendingPayment"
  | "pendingPickup"
  | "completed"
  | "cancelled"
  | "refunding"
  | "refunded";

export interface OrderItem {
  productId: string;
  productName: string;
  imageUrl: string;
  price: number;
  quantity: number;
  unit: string;
}

export interface Order {
  id: string;
  orderNo: string;
  userId: string;
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
