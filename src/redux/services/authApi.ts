// src/api/authApi.ts
import { TAG_GET_USER_PROFILE } from "@/types/baseApiTags";
import { baseApi } from ".";
import {
  type LoginResponse,
  type LogoutResponse,
  type RequestPasswordResetResponse,
  type ResetPasswordResponse,
} from "@/types/responses";
import type { LoginRequest, ForgotPasswordRequest, ResetPasswordRequest } from "@/types/requests";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: ({ username, password, recaptcha_token }) => {
        const basicAuthHeader = `Basic ${btoa(`${username}:${password}`)}`;
        return {
          url: "/auth/client",
          method: "POST",
          headers: {
            Authorization: basicAuthHeader,
          },
          // auth: { username, password },
          body: { recaptcha_token: recaptcha_token, },
          params: {
            app: 'affiliate-admin'
          }
        };
      },
      invalidatesTags: [TAG_GET_USER_PROFILE],
    }),

    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

    forgotPassword: builder.mutation<RequestPasswordResetResponse, ForgotPasswordRequest>({
      query: ({ email }) => ({
        url: "/auth/forgot",
        method: "POST",
        body: { email },
      }),
    }),

    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
      query: ({ access_token, password, passwordConfirm }) => ({
        url: `/auth/reset?access_token=${access_token}`,
        method: "POST",
        body: { access_token, password, passwordConfirm },
      }),
    }),

  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,

} = authApi;

export default authApi;
