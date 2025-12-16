import type { ADDRESS } from "@/redux/slices/create-order";

export interface ICreateSubscriptionRequest {
  order: string;
  patient: string;
  productVariations: {
    variationId: string;
    quantity: number;
    pricePerUnitOverride?: number;
  }[];
  schedule: {
    interval: string;
    intervalCount: number;
    startDate: string;
  };
  address?: string;
  billingDetails?: ADDRESS;
  shippingDetails?: ADDRESS;
}
