import type { ProductVariationType } from "@/constants";

export interface MappedProductVariation {
  id: string;
  name: string;
}

export interface ProductVariationMapping {
  id: string;
  name: string;
  ecommercePlatform: string;
  ecommerceVariationId?: string;
  productType: ProductVariationType;
  regularPrice: number;
  subscriptionPeriod?: "month" | "week";
  subscriptionPeriodInterval?: number;
  mappedProductVariation: MappedProductVariation;
  systemMappingId: string;
  isMapped: boolean;
}

export interface ProductVariationsResponse {
  count: number;
  mappings: ProductVariationMapping[];
}

export interface GetProductVariationsRequest {
  page?: number;
  limit?: number;
  isMapped?: boolean;
  q?: string;
}