export interface IValidateCouponResponse {
  message?: string;
  error?: string;
  cartTotalBefore: number;
  totalDiscount: string;
  cartTotalAfter: number;
  coupon: {
    code: string;
    id: string;
  };
}
