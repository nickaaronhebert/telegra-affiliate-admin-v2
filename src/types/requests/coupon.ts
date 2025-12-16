export interface ICreateCouponRequest {
  code: string;
  description: string;
  discountType: "percent" | "fixed_cart";
  amount: number;
  freeShipping: boolean;
  individualUse: boolean;
  usageLimit: number;
  usageLimitPerUser: number;
  minimumAmount: number;
  maximumAmount: number;
  productIds?: string[];
  dateExpires: string;
  status: "active" | "draft" | "expired" | "disabled";
  metadata?: Record<string, any>;
}

export interface IUpdateCouponRequest extends Partial<ICreateCouponRequest> {
  id: string;
}
