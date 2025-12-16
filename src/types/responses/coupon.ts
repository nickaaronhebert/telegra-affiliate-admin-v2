export interface ProductVariation {
  _id: string;
  affiliate: string;
  parentProduct: string;
  name: string;
  regularPrice: number;
  currency: string;
  subscriptionPeriod?: string;
  subscriptionPeriodInterval?: number;
  subscriptionLength: number;
  subscriptionSignUpFee: number;
  productType: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  ecommercePlatform: string;
  ecommerceVariationId: string;
  productVariation: string;
  currentPrice: number;
  isSubscription: boolean;
  id: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: "percent" | "fixed_cart";
  amount: number;
  freeShipping: boolean;
  individualUse: boolean;
  usageLimit: number;
  usageLimitPerUser: number;
  usageCount: number;
  minimumAmount: number;
  maximumAmount: number;
  productIds: ProductVariation[];
  dateExpires: string;
  status: "active" | "draft" | "expired" | "disabled";
  createdAt: string;
  updatedAt: string;
  affiliate: string;
}

export interface IGetCouponById {
  data: Coupon;
  message: string;
  code: string;
}

export interface ICreateCouponResponse {
  message: string;
  code: string;
}

export interface IViewAllCouponsResponse {
  result: Coupon[];
  count: number;
}
