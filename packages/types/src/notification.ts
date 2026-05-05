export type NotificationType = "ORDER" | "PAYMENT" | "AFTER_SALE" | "SYSTEM";

export interface Notification {
  id: string;
  customerId: string;
  type: NotificationType;
  title: string;
  content: string;
  payload?: unknown;
  readAt?: string | null;
  createdAt: string;
}
