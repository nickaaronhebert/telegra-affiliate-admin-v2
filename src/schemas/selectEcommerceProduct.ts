import { z } from "zod";

export const ecommerceProductVariation = z.object({
  productVariation: z.string().min(1, "Product is required"),
  productName: z.string().min(1, "Product Name is required"),
  quantity: z.coerce
    .number({
      message: "Invalid Number",
    })
    .int("Invalid Number")
    .positive("Invalid Number"),

  pricePerUnitOverride: z.coerce
    .number({
      message: "Invalid Number",
    })
    .int("Invalid Number")
    .gt(0, "Price must be greater than 0"),
});

export const productsSchema = z.object({
  productVariations: z
    .array(ecommerceProductVariation)
    .min(1, "At least one medication must be added"),
});
