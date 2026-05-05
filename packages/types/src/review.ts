export interface ProductReview {
  id: string;
  customerId: string;
  orderId: string;
  orderItemId: string;
  productId: string;
  skuId: string;
  rating: number;
  content?: string | null;
  imageUrls: string[];
  anonymous: boolean;
  createdAt: string;
}
