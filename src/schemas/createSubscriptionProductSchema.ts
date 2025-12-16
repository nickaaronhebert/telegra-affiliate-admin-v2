import z from "zod";
import { ecommerceProductVariation } from "./selectEcommerceProduct";

export const subscriptionSchema = z.object({
  order: z.string().min(1, "Order is required"),
  interval: z.string().min(1, "Interval is required"),
  intervalCount: z.coerce
    .number({
      message: "Invalid Number",
    })
    .int("Invalid Number")
    .positive("Invalid number"),
  startDate: z.string().min(1, "Start Date is required"),
  endDate: z.string().optional(),
  productVariations: z
    .array(ecommerceProductVariation)
    .min(1, "At least one medication must be added"),
});
