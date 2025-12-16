import { z } from "zod";

const productVariationSchema = z.object({
  productVariation: z.string().min(1, "Product variation is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  pricePerUnitOverride: z.number().positive("Price per unit must be positive"),
  billingCycleLength: z.number().positive().optional(),
});

const preCheckoutQuestionnaireSchema = z.object({
  questionnaire: z.string().min(1, "Questionnaire is required"),
  isPreAuthQuestionnaire: z.boolean(),
});

export const journeySchema = z.object({
  affiliate: z.string().min(1, "Affiliate is required"),
  name: z.string().min(1, "Journey name is required"),
  productVariations: z.array(productVariationSchema).min(1, {
    message: "At least one product variation is required",
  }),
  preCheckoutQuestionnaire: z.array(preCheckoutQuestionnaireSchema).optional(),
});
