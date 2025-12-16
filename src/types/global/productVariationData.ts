import type { ProductVariationMapping } from "@/types/responses/productVariations";

export interface ProductVariationData {
  productVariation: ProductVariationMapping | null;
  quantity: number;
  overwritePrice: number;
  billingCycleLength: number;
}

export interface ProductVariationItem {
  id: string;
  productVariation: ProductVariationMapping | null;
  quantity: number;
  pricePerUnitOverride: number;
  billingCycleLength?: number;
}