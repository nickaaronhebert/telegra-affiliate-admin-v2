import { z } from "zod";

// Zod validation schema
export const selectOrderPaymentSchema = z.object({
  payment: z.string().min(1, { message: "Payment Method is required" }),
});
