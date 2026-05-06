import type { Prisma } from "../../generated/prisma/client";

type ProductWithSkus = Prisma.ProductGetPayload<{
  include: { category: true; skus: true };
}>;

/**
 * 将商品数据库对象转换为接口响应对象。
 */
export function presentProduct(product: ProductWithSkus) {
  return {
    id: product.id,
    categoryId: product.categoryId,
    category: product.category,
    name: product.name,
    subtitle: product.subtitle,
    imageUrl: product.imageUrl,
    description: product.description,
    sales: product.sales,
    badge: product.badge,
    enabled: product.enabled,
    sort: product.sort,
    skus: product.skus.map((sku) => ({
      id: sku.id,
      productId: sku.productId,
      name: sku.name,
      unit: sku.unit,
      price: Number(sku.price),
      marketPrice: sku.marketPrice ? Number(sku.marketPrice) : null,
      stock: sku.stock,
      lockedStock: sku.lockedStock,
      enabled: sku.enabled,
    })),
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}
