export interface LoginRequest {
  username: string;
  password: string;
  recaptcha_token?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  access_token: string;
  password: string;
  passwordConfirm: string;
}

export * from "./coupon";
export * from "./subscription";
