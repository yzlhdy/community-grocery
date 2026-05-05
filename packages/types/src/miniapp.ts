import type { Category, Product } from "./product";
import type { Community, PickupPoint } from "./community";
import type { HomeBanner } from "./marketing";

export interface OrderSummary {
  pendingPayment: number;
  pendingPickup: number;
  completed: number;
  refunding: number;
}

export interface MiniappHomeData {
  community: Community | null;
  pickupPoint: PickupPoint | null;
  leader: {
    name: string;
    avatarUrl?: string | null;
    phone?: string | null;
    serviceTimeRange?: string | null;
  } | null;
  banners: HomeBanner[];
  categories: Category[];
  seckill: unknown;
  recommend: unknown;
  orderSummary: OrderSummary;
  badges: {
    cart: number;
    pendingPayment: number;
    pendingPickup: number;
  };
}

export interface MiniappCategoryPageData {
  categories: Array<Category & { children: Category[] }>;
  selectedCategoryId?: string;
  products: Product[];
}
