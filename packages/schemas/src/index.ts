import { z } from "zod";

export const productSchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  name: z.string().min(1),
  subtitle: z.string().optional(),
  imageUrl: z.string(),
  description: z.string().optional(),
  skus: z.array(
    z.object({
      id: z.string(),
      productId: z.string(),
      name: z.string(),
      unit: z.string().min(1),
      price: z.number().nonnegative(),
      marketPrice: z.number().nonnegative().nullable().optional(),
      stock: z.number().int().nonnegative(),
      lockedStock: z.number().int().nonnegative(),
      enabled: z.boolean(),
    }),
  ),
  enabled: z.boolean(),
});

export const createOrderSchema = z.object({
  communityId: z.string(),
  pickupPointId: z.string(),
  items: z
    .array(
      z.object({
        skuId: z.string(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
});

export const adminLoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const wechatLoginSchema = z.object({
  code: z.string().min(1),
  nickname: z.string().optional(),
  avatarUrl: z.string().optional(),
});

export const upsertCartItemSchema = z.object({
  skuId: z.string(),
  quantity: z.number().int().positive(),
});

export const wechatPaymentNotifySchema = z.object({
  paymentNo: z.string().min(1),
  transactionId: z.string().optional(),
  status: z.enum(["SUCCESS", "FAILED"]).optional(),
  rawPayload: z.unknown().optional(),
});

export const upsertCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  parentId: z.string().nullable().optional(),
  level: z.number().int().positive(),
  iconUrl: z.string().optional(),
  sort: z.number().int().optional(),
  enabled: z.boolean().optional(),
});

export const upsertCommunitySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  address: z.string().min(1),
  enabled: z.boolean().optional(),
});

export const upsertPickupPointSchema = z.object({
  id: z.string().optional(),
  communityId: z.string().min(1),
  name: z.string().min(1),
  address: z.string().min(1),
  contactName: z.string().min(1),
  contactPhone: z.string().min(1),
  pickupTimeRange: z.string().min(1),
  enabled: z.boolean().optional(),
});
