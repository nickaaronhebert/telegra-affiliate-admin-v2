// src/api/authApi.ts
import { TAG_GET_USER_PROFILE } from "@/types/baseApiTags";
import { baseApi } from ".";
import {
  type LoginResponse,
  type LogoutResponse,
  type RequestPasswordResetResponse,
  type ResetPasswordResponse,
  type SendOtpResponse,
  type VerifyOtpResponse,
} from "@/types/responses";
import type { LoginRequest, ForgotPasswordRequest, ResetPasswordRequest } from "@/types/requests";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: ({ username, password, recaptcha_token }) => {
        const disabled2FA = `${import.meta.env.VITE_ENABLE_2FA}` === "false";
        const url = disabled2FA ? "/auth/client" : "/auth/login";

        return {
          url,
          method: "POST",
          headers: {
            Authorization: `Basic ${btoa(`${username}:${password}`)}`,
            Accept: "application/json, text/plain, */*",
          },
          body: { recaptcha_token },
          params: {
            app: "affiliate-admin",
          },
        };
      },
      invalidatesTags: [TAG_GET_USER_PROFILE],
    }),

    sendOtpCode: builder.mutation<SendOtpResponse, { access_token: string; method: 'email' | 'sms' }>({
      query: ({ access_token, method }) => ({
        url: "/auth/client/otp-code",
        method: "GET",
        params: {
          access_token,
          method,
        },
      }),
    }),

    verifyOtpCode: builder.mutation<VerifyOtpResponse, { access_token: string; code: string }>({
      query: ({ access_token, code }) => ({
        url: "/auth/client/otp-code",
        method: "POST",
        params: {
          access_token,
          code,
        },
      }),
      invalidatesTags: [TAG_GET_USER_PROFILE],
    }),

    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

    forgotPassword: builder.mutation<
      RequestPasswordResetResponse,
      ForgotPasswordRequest
    >({
      query: ({ email }) => ({
        url: "/auth/forgot",
        method: "POST",
        body: { email },
      }),
    }),

    resetPassword: builder.mutation<
      ResetPasswordResponse,
      ResetPasswordRequest
    >({
      query: ({ access_token, password, passwordConfirm }) => ({
        url: `/auth/reset`,
        method: "POST",
        params: { access_token },
        body: { password, passwordConfirm },
      }),
    }),
  }),
  overrideExisting: false,
});


export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useSendOtpCodeMutation,
  useVerifyOtpCodeMutation,
} = authApi;

export default authApi;
