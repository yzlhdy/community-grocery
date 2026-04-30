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
  price: number;
  marketPrice?: number;
  unit: string;
  stock: number;
  sales: number;
  enabled: boolean;
}
