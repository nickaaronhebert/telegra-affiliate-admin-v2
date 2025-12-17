import { z } from "zod";
import { addressSchema } from "./selectOrderAddress";

const productVariations = z.object({
  productVariation: z.string().min(1, "Product Variation is required"),
  quantity: z.string().min(1, "Quantity is required"),
});

export const labOrderSchema = z
  .object({
    prefill: z.string().optional(),
    createOrderAfterResults: z.boolean(),
    address: addressSchema,
    lab: z.string().min(1, { message: "Lab is required." }),
    labPanels: z.array(z.string()).optional(),
    afterResultsOrderProductVariations: z.array(productVariations).optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.createOrderAfterResults &&
      (!data.afterResultsOrderProductVariations ||
        data.afterResultsOrderProductVariations.length === 0)
    ) {
      ctx.addIssue({
        path: ["createOrderAfterResults"],
        message:
          "At least one product variation is required when Create Order After Results is enabled.",
        code: z.ZodIssueCode.custom,
      });
    }
  });
