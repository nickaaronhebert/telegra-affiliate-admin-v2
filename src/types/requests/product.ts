export interface ICreateProductRequest {
  description: string;
  strength: string;
  form: string;
  pricePerUnit: number;
  productId: string;
  subscription: boolean;
  typicalDuration: number;
  isProviderAdjustmentRequired: boolean;
  tags: string[];
}