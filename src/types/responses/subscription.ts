export interface State {
  _id: string;
  name: string;
  abbreviation: string;
  id: string;
}

export interface Address {
  address1: string;
  address2: string;
  city: string;
  state: State;
  zipcode: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}

export interface Order {
  id: string;
  status: string;
  ecommerceOrderId: string;
  billingDetails: any;
  shippingDetails: any;
  totalAmount: number | null;
  createdAt: string;
  addressId: string | null;
}

export interface Patient {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  genderBiological: string;
  dateOfBirth: string;
}

export interface Schedule {
  interval: string;
  intervalCount: number;
  startDate: string;
  nextPayment: string;
  endDate: string | null;
}

export interface Subscription {
  id: string;
  order: Order;
  patient: Patient;
  productVariations: any[];
  billingDetails: Address;
  shippingDetails: Address;
  schedule: Schedule;
  status: string;
  totalAmount: number;
  paymentProcessor: string;
  affiliate: string;
  // ecommerceSubscriptionId: string;
  renewalOrders: any[];
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionDetails {
  id: string;
  order: {
    id: string;
    ecommerceOrderId: string;
    totalAmount: number | null;
    amount: number | null;
    currency: string;
  };
  patient: Patient;
  productVariations: {
    parentProduct: {
      id: string;
      name: string;
      ecommerceProductId: string;
      isSubscription: boolean;
    };
    id: string;
    name: string;
    regularPrice: string;
    productType: string;
    currentPrice: string;
    isSubscription: boolean;
    quantity: number;
    pricePerUnitOverride: number;
    billingCycleLength: number;
    total: number;
  }[];
  billingDetails: Address;
  shippingDetails: Address;
  schedule: Schedule;
  status: string;
  totalAmount: number;
  paymentProcessor: string;
  affiliate: string;
  // ecommerceSubscriptionId: string;
  renewalOrders: any[];
  createdAt: string;
  updatedAt: string;
}

export interface IGetSubscriptionById extends SubscriptionDetails {
  // data: SubscriptionDetails;
  message: string;
  code: string;
}

export interface ICreateSubscriptionResponse {
  message: string;
  code: string;
}

export interface IViewAllSubscriptionsResponse {
  result: Subscription[];
  count: number;
}
