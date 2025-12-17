export interface ProductVariationItem {
  id: string;
  name: string;
  sku?: string;
  price: number;
  regularPrice?: number;
  currency?: string;
  productType?: string;
  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  product?: {
    id: string;
    title: string;
  };
  description?: string;
}

export interface ProductVariationsListResponse {
  productVariations: ProductVariationItem[];
  count: number;
}

export interface GetProductVariationsListRequest {
  page?: number;
  limit?: number;
  q?: string;
  withoutProducts?: string;
}

