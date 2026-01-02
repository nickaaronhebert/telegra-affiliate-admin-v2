export interface IEditSubscriptionPayload {
  order: string;
  patient: string;
  billingDetails?: {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipcode: string;
  };
  shippingDetails?: {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipcode: string;
  };
  productVariations: {
    variationId: string;
    quantity: number;
    pricePerUnitOverride: number;
  }[];
  schedule: {
    interval: string;
    intervalCount: number;
    startDate: string;
    endDate?: string;
  };
  address?: string;
  id: string;
}
