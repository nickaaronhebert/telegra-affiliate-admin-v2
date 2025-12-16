export interface Patient {
  id: string;
  [key: string]: any;
}

export interface BillingDetails {
  id: string;
  [key: string]: any;
}

export interface ShippingDetails {
  id: string;
  [key: string]: any;
}

export interface OrderItem {
  id: string;
  status: string;
  paymentProcessor: string;
  paymentIntent: string;
  affiliate: string;
  patient: Patient;
  ecommerceOrderId: string;
  relatedSubscriptions: any[];
  productVariations: { id: string; name: string; quantity: number }[];
  billingDetails: BillingDetails;
  shippingDetails: ShippingDetails;
  subtotal: number;
  discountAmount: number;
  coupon: string | null;
  totalAmount: number;
  isLockedin: boolean;
  isCancelable: boolean;
  isRefundable: boolean;
  totalRefunded: number;
  hasRefunds: boolean;
  createdAt: string;
  addressId: string;
}

export interface IViewAllOrderInterface {
  result: OrderItem[];
  count: number;
}
