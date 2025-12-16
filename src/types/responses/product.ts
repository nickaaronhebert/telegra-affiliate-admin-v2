import type { ProductVariation } from "./IViewAllProducts";

export interface IGetProductById {
  data: ProductVariation;
  message: string;
  code: string;
}

export interface ICreateProductResponse {
  message: string;
  code: string;
}