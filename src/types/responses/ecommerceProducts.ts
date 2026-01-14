// Types for the new ecommerce products API
import type { ProductType } from "@/constants";
import type { ICompactTag } from "./tag";

export interface ProductVariation {
  _id: string;
  affiliate: string;
  parentProduct: string;
  name: string;
  regularPrice: number;
  currency: string;
  subscriptionPeriod: string;
  subscriptionPeriodInterval: number;
  subscriptionLength: number;
  subscriptionSignUpFee: number;
  productType: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  productVariation?: string;
  currentPrice: number;
  isSubscription: boolean;
  id: string;
  ecommercePlatform?: string;
  ecommerceVariationId?: string;
}

export interface EcommerceProduct {
  id: string;
  name: string;
  productType: ProductType;
  regularPrice?: number;
  currentPrice?: number;
  currency: string;
  isSubscription: boolean;
  createdAt: string;
  updatedAt: string;
  productVariations?: ProductVariation[];
  tags?: ICompactTag[];
}

export interface EcommerceProductsResponse {
  products: EcommerceProduct[];
  count: number;
}