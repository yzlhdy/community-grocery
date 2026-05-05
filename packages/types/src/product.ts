export type CategoryLevel = 1 | 2 | 3;

export interface Category {
  id: string;
  name: string;
  parentId: string | null;
  level: CategoryLevel;
  iconUrl?: string;
  sort: number;
  enabled: boolean;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  subtitle?: string;
  imageUrl: string;
  description?: string;
  skus: Sku[];
  sales: number;
  badge?: string | null;
  enabled: boolean;
}

export interface Sku {
  id: string;
  productId: string;
  name: string;
  unit: string;
  price: number;
  marketPrice?: number | null;
  stock: number;
  lockedStock: number;
  enabled: boolean;
}
