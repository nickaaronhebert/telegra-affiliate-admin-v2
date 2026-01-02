interface PaymentIntent {
  id: string;
  paymentMethod: string;
  amount: number;
  currency: string;
  status: string;
}

interface ProductVariation {
  id: string;
  name: string;
  currentPrice: number;
  regularPrice: number;
  productType: string;
  parentProduct: string;
  isSubscription: boolean;
  quantity: number;
  pricePerUnitOverride: number;
  total: number;
}

interface PaymentDetails {
  cardBrand: string;
  last4: string;
  currency: string;
}

export interface IViewOrderDetailsResponse {
  id: string;
  status: string;
  createdAt: string;
  isCancelable: boolean;
  isLockedin: boolean;
  paymentIntent: PaymentIntent;
  affiliate: string;
  patient: {
    id: string;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    genderBiological: string;
    name: string;
  };

  ecommerceOrderId: string;
  productVariations: ProductVariation[];
  address: {
    _id: string;
    billing: {
      address1: string;
      address2: string;
      city: string;
      state: string;
      zipcode: string;
      id: string;
    };
    shipping: {
      address1: string;
      address2: string;
      city: string;
      state: string;
      zipcode: string;
      id: string;
    };
  };

  paymentDetails: PaymentDetails;
  addressId: string;
  subtotal: number;
  discountAmount: number;
  coupon: string;
  totalAmount: number;
  amount: number;
  currency: string;
}
