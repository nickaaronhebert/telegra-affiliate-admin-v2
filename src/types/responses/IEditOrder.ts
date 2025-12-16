export interface IEditOrderResponse {
  subtotal: string;
  totalAmount: string;
  id: string;
  productVariations: {
    productVariation: string;
    quantity: number;
    pricePerUnitOverride: number;
  }[];
  shippingDetails?: {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipcode: string;
  };
  billingDetails?: {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipcode: string;
  };
  address?: string;
}
