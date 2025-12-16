import { z } from "zod";

export const createCouponSchema = z.object({
  code: z.string().min(3, "Coupon code must be at least 3 characters"),
  discountType: z.enum(["percent", "fixed_cart"], {
    message: "Please select a discount type",
  }),
  amount: z.number().min(0.01, "Discount value must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  
  // Advanced options
  usageLimit: z.number().min(0, "Usage limit must be 0 or greater").optional(),
  usageLimitPerUser: z.number().min(0, "Usage limit per user must be 0 or greater").optional(),
  minimumAmount: z.number().min(0, "Minimum amount must be 0 or greater").optional(),
  maximumAmount: z.number().min(0, "Maximum amount must be 0 or greater").optional(),
  dateExpires: z.string().optional(),
  status: z.enum(["active", "draft", "expired", "disabled"], {
    message: "Please select a status",
  }),
});

export type CreateCouponFormData = z.infer<typeof createCouponSchema>;