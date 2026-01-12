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
  ecommerceSubscriptionId: string;
  // order: Order;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
  };
  productVariations: {
    _id: string;
    name: string;
  }[];
  status: string;
  totalAmount: number;
  currency: string;
  interval: string;
  intervalCount: string;
  startDate: string;
  nextPayment: string;
  endDate: string;
  createdAt: string;
  parentOrder: {
    _id: string;
    ecommerceOrderId: string;
  };
}

export interface SubscriptionDetails {
  id: string;
  ecommerceSubscriptionId: string;
  status: string;
  totalAmount: number;
  schedule: Schedule;
  parentOrder: {
    _id: string;
    ecommerceOrderId: string;
    totalAmount: number | null;
    status: string;
  };
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    genderBiological: string;
    medicationAllergies: string[];
    patientMedications: string[];
  };
  address: {
    _id: string;
    billing: {
      address1: string;
      address2: string;
      city: string;
      state: {
        _id: string;
        name: string;
        abbreviation: string;
      };
      zipcode: string;
      _id: string;
      createdAt: string;
      updatedAt: string;
    };
    shipping: {
      address1: string;
      address2: string;
      city: string;
      state: {
        _id: string;
        name: string;
        abbreviation: string;
      };
      zipcode: string;
      _id: string;
      createdAt: string;
      updatedAt: string;
    };
  };
  productVariations: {
    _id: string;
    name: string;
    regularPrice: number;
    productType: string;
    quantity: number;
    pricePerUnitOverride: number;
    billingCycleLength: number;
  }[];
  paymentProcessor: string;
  paymentIntent: string;
  createdAt: string;
  updatedAt: string;
  relatedOrders: {
    id: string;
    ecommerceOrderId: string;
    status: string;
    totalAmount: number;
    currency: string;
    type: string;
  }[];
}

export interface IGetSubscriptionById extends SubscriptionDetails {}

export interface ICreateSubscriptionResponse {
  message: string;
  code: string;
}

export interface IViewAllSubscriptionsResponse {
  result: Subscription[];
  count: number;
}
