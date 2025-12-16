import { baseApi } from "./index";
import { TAG_GET_PRODUCT_VARIATIONS } from "@/types/baseApiTags";
import type {
  ProductVariationsResponse,
  GetProductVariationsRequest,
} from "@/types/responses/productVariations";

export const productVariationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductVariations: builder.query<
      ProductVariationsResponse,
      GetProductVariationsRequest
    >({
      query: ({ page = 1, limit = 100, isMapped, q }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        if (isMapped !== undefined) {
          params.append("isMapped", isMapped.toString());
        }

        if (q && q.trim()) {
          params.append("q", q.trim());
        }

        return {
          url: `ecommerceProductVariations/mapping?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: [TAG_GET_PRODUCT_VARIATIONS],
    }),
    getAllProductVariations: builder.query<
      { productVariations: any[]; count: number },
      { page?: number; limit?: number; q?: string; withoutProducts?: string }
    >({
      query: ({ page = 1, limit = 500, q = "", withoutProducts = "" }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          q,
          withoutProducts,
        });
        return {
          url: `/productVariations?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: [TAG_GET_PRODUCT_VARIATIONS],
    }),
  }),
  overrideExisting: false,
});

export const { useGetProductVariationsQuery, useGetAllProductVariationsQuery } = productVariationsApi;