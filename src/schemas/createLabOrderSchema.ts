import { z } from "zod";

export const createLabOrderSchema = z.object({
  userAddress: z.string().optional(),
  address1: z.string().min(1, "Address line 1 is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipcode: z.string().min(1, "Zip code is required"),
  lab: z.string().min(1, "Lab is required"),
  labPanels: z.array(z.string()).optional(),
  project: z.string().optional(),
  createPostResults: z.boolean().optional(),
  productVariations: z.array(
    z.object({
      id: z.string(),
      productVariation: z
        .object({
          id: z.string(),
        })
        .nullable(),
      quantity: z.number().min(1, "Quantity must be at least 1"),
      pricePerUnitOverride: z.number().min(0),
      billingCycleLength: z.number().optional(),
    })
  ),
});

export type CreateLabOrderFormData = z.infer<typeof createLabOrderSchema>;
