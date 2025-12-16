import { baseApi } from ".";
import type {
  ICreateCouponResponse,
  IGetCouponById,
  IViewAllCouponsResponse,
} from "@/types/responses/coupon";
import type {
  ICreateCouponRequest,
  IUpdateCouponRequest,
} from "@/types/requests/coupon";
import { TAG_GET_COUPONS } from "@/types/baseApiTags";
import type { IValidateCouponRequest } from "@/types/requests/IValidateCoupon";
import type { IValidateCouponResponse } from "@/types/responses/IValidateCoupon";

const couponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    viewAllCoupons: builder.query<IViewAllCouponsResponse, { page?: any; perPage?: any; code?: string; }>({
      query: ({ page, perPage, code }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: perPage.toString(),
        });
        if (code) {
          params.append("code", code);
        }
        return {
          url: `/ecommerceCoupons?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) => {
        return result
          ? [
            ...result?.result?.map(({ id }) => ({
              type: TAG_GET_COUPONS,
              id,
            })),
            { type: TAG_GET_COUPONS, id: "LIST" },
          ]
          : [{ type: TAG_GET_COUPONS, id: "LIST" }];
      },
    }),

    viewCouponById: builder.query<IGetCouponById, string>({
      query: (id) => {
        return {
          url: `/ecommerceCoupons/${id}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, id) => [{ type: TAG_GET_COUPONS, id }],
    }),

    createCoupon: builder.mutation<ICreateCouponResponse, ICreateCouponRequest>(
      {
        query: (body) => {
          return {
            url: `/ecommerceCoupons`,
            method: "POST",
            body,
          };
        },
        invalidatesTags: (result) =>
          result ? [{ type: TAG_GET_COUPONS, id: "LIST" }] : [],
      }
    ),

    validateCoupon: builder.mutation<
      IValidateCouponResponse,
      IValidateCouponRequest
    >({
      query: (body) => {
        return {
          url: `/ecommerceCoupons/validate`,
          method: "POST",
          body,
        };
      },
    }),

    updateCoupon: builder.mutation<ICreateCouponResponse, IUpdateCouponRequest>(
      {
        query: ({ id, ...body }) => {
          return {
            url: `/ecommerceCoupons/${id}`,
            method: "PUT",
            body,
          };
        },
        invalidatesTags: (result, _error, { id }) =>
          result
            ? [
              { type: TAG_GET_COUPONS, id },
              { type: TAG_GET_COUPONS, id: "LIST" },
            ]
            : [],
      }
    ),
  }),
});

export const {
  useViewAllCouponsQuery,
  useViewCouponByIdQuery,
  useCreateCouponMutation,
  useValidateCouponMutation,
  useUpdateCouponMutation,
} = couponApi;

export default couponApi;
