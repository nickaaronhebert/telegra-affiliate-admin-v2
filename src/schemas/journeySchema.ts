import { z } from "zod";

const brandColorsSchema = z.object({
  primary: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Primary color must be a valid hex color"),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Accent color must be a valid hex color"),
  neutral: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Neutral color must be a valid hex color"),
});

const themeSchema = z.object({
  layout: z.string().min(1, "Theme layout is required"),
  inheritFromAffiliate: z.boolean(),
  brandColors: brandColorsSchema,
});

const productVariationSchema = z.object({
  productVariation: z.string().min(1, "Product variation is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  pricePerUnitOverride: z.number().positive("Price per unit must be positive").optional(),
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
  theme: themeSchema.optional(),
  metadata: z.record(z.any()).optional(),
});
