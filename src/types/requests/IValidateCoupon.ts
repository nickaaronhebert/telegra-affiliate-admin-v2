export interface IValidateCouponRequest {
  couponCode: string;
  lineItems: {
    id: string;
    quantity: number;
    total: number;
  }[];
  patient: string;
}
