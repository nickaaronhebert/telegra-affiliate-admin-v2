import type { User } from "../global/commonTypes";

export interface LoginResponse {
  token?: string;
  user?: User;
  statusCode: number;
}

export interface SendOtpResponse {
  message: string;
  statusCode?: number;
}

export interface VerifyOtpResponse {
  token: string;
  user: User;
}

export interface LogoutResponse {
  success: boolean;
}

export interface RequestPasswordResetResponse {
  access_token: string;
  statusCode: number;
}

export interface ResetPasswordResponse {
  access_token: string;
}

export interface ResendOtpResponse {
  message: string;
}

export * from "./coupon";
export * from "./subscription";
export * from "./organizationIdentity";
export * from "./communicationTemplates";
