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
  form?: string;
  product?: {
    id: string;
    title: string;
  };
  description?: string;
  strength: string;
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
