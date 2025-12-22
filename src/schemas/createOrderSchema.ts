import { z } from "zod";

export const createOrderSchema = z.object({
  userAddress: z.string().optional(),
  address1: z.string().min(1, "Address line 1 is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipcode: z.string().min(1, "Zip code is required"),
  project: z.string().optional(),
  paymentMethod: z.string().optional().nullable(),
  productVariations: z.array(z.object({
    id: z.string(),
    productVariation: z.object({
      id: z.string(),
    }).nullable(),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    pricePerUnitOverride: z.number().min(0),
    billingCycleLength: z.number().optional(),
  })).min(1, "At least one product variation is required"),
});

export type CreateOrderFormData = z.infer<typeof createOrderSchema>;