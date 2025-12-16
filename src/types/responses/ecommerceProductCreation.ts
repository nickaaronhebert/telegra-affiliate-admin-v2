import type { ProductType } from "@/constants";

// Common interfaces for ecommerce product variations
export interface EcommerceProductVariation {
  _id: string;
  affiliate: string;
  parentProduct: string;
  name: string;
  regularPrice: number;
  currency: string;
  subscriptionPeriod?: string;
  subscriptionPeriodInterval?: number;
  subscriptionLength: number;
  subscriptionSignUpFee: number;
  productType: ProductType;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  ecommercePlatform: string;
  ecommerceVariationId: string;
  currentPrice: number;
  isSubscription: boolean;
  id: string;
}

export interface ProductVariation {
  name: string;
  regularPrice: number;
  subscriptionPeriod?: string;
  subscriptionPeriodInterval?: number;
  subscriptionLength?: number;
  subscriptionSignUpFee?: number;
}

export interface EcommerceProductMetadata {
  ecommerceProduct: {
    id: number;
    name: string;
    slug: string;
    permalink: string;
    date_created: string;
    date_created_gmt: string;
    date_modified: string;
    date_modified_gmt: string;
    type: string;
    status: string;
    featured: boolean;
    catalog_visibility: string;
    description: string;
    short_description: string;
    sku: string;
    price: string;
    regular_price: string;
    sale_price: string;
    date_on_sale_from: string | null;
    date_on_sale_from_gmt: string | null;
    date_on_sale_to: string | null;
    date_on_sale_to_gmt: string | null;
    on_sale: boolean;
    purchasable: boolean;
    total_sales: number;
    virtual: boolean;
    downloadable: boolean;
    downloads: any[];
    download_limit: number;
    download_expiry: number;
    external_url: string;
    button_text: string;
    tax_status: string;
    tax_class: string;
    manage_stock: boolean;
    stock_quantity: number | null;
    backorders: string;
    backorders_allowed: boolean;
    backordered: boolean;
    low_stock_amount: number | null;
    sold_individually: boolean;
    weight: string;
    dimensions: {
      length: string;
      width: string;
      height: string;
    };
    shipping_required: boolean;
    shipping_taxable: boolean;
    shipping_class: string;
    shipping_class_id: number;
    reviews_allowed: boolean;
    average_rating: string;
    rating_count: number;
    upsell_ids: any[];
    cross_sell_ids: any[];
    parent_id: number;
    purchase_note: string;
    categories: Array<{
      id: number;
      name: string;
      slug: string;
    }>;
    brands: any[];
    tags: any[];
    images: any[];
    attributes: any[];
    default_attributes: any[];
    variations: number[];
    grouped_products: any[];
    menu_order: number;
    price_html: string;
    related_ids: number[];
    meta_data: Array<{
      id: number;
      key: string;
      value: any;
    }>;
    stock_status: string;
    has_options: boolean;
    post_password: string;
    global_unique_id: string;
    permalink_template?: string;
    generated_slug?: string;
    _links?: any;
  };
}

// Base product interface
interface BaseProduct {
  id: string;
  name: string;
  productType: ProductType;
  currency: string;
  isSubscription: boolean;
  ecommerceProductVariations: EcommerceProductVariation[];
  createdAt: string;
  updatedAt: string;
  description: string;
  sku: string;
  subscriptionLength: number;
  subscriptionSignUpFee: number;
  ecommercePlatform: string;
  ecommerceProductId: string;
  metadata: EcommerceProductMetadata;
}

// One-time product response
export interface OneTimeProductResponse {
  product: BaseProduct & {
    regularPrice: number;
    currentPrice: number;
    variations: any[];
  };
}

// Subscription fixed product response
export interface SubscriptionFixedProductResponse {
  product: BaseProduct & {
    regularPrice: number;
    currentPrice: number;
    subscriptionPeriod: string;
    subscriptionPeriodInterval: number;
    variations: any[];
  };
}

// Subscription variable product response
export interface SubscriptionVariableProductResponse {
  product: BaseProduct & {
    variations: ProductVariation[];
  };
}

// Union type for all product creation responses
export type CreateEcommerceProductResponse =
  | OneTimeProductResponse
  | SubscriptionFixedProductResponse
  | SubscriptionVariableProductResponse;

// Mapping API types
export interface ProductMappingRequest {
  mappings: Array<{
    ecommerceProductVariationId: string;
    productVariationId: string;
  }>;
}

export interface ProductMappingResponse {
  success: boolean;
  message?: string;
}