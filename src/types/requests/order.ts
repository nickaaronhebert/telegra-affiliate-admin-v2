import type { ADDRESS } from "@/redux/slices/create-order";

export interface ICreateOrderRequest {
  patient: string;
  address?: string;
  productVariations: {
    productVariation: string;
    quantity: number;
    pricePerUnitOverride: number;
  }[];
  subtotal: string;
  totalAmount: string;
  paymentMethodId: string;
  shippingDetails?: ADDRESS;
  billingDetails?: ADDRESS;
  coupon?: string;
}
