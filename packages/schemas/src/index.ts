import { z } from "zod";

export const productSchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  name: z.string().min(1),
  subtitle: z.string().optional(),
  imageUrl: z.string(),
  price: z.number().nonnegative(),
  unit: z.string().min(1),
  stock: z.number().int().nonnegative(),
  enabled: z.boolean(),
});

export const createOrderSchema = z.object({
  communityId: z.string(),
  pickupPointId: z.string(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
});
