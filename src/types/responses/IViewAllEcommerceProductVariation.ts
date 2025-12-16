interface EcommerceProduct {
  id: string;
  name: string;
  ecommercePlatform: string;
  ecommerceVariationId: string;
  productType: string;
  regularPrice: number;
  subscriptionPeriod: string;
  subscriptionPeriodInterval: number;
  mappedProductVariation: {
    id: string;
    name: string;
  };
}
export interface IViewAllEcommerceProductVariationsResponse {
  count: number;
  mappings: EcommerceProduct[];
}
