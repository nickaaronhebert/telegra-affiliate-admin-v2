import { baseApi } from "./index";
import { TAG_GET_PRODUCT_VARIATIONS_LIST } from "@/types/baseApiTags";
import type {
  ProductVariationsListResponse,
  GetProductVariationsListRequest,
} from "@/types/responses/productVariationsList";

export const productVariationsListApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductVariationsList: builder.query<
      ProductVariationsListResponse,
      GetProductVariationsListRequest
    >({
      query: ({ page = 1, limit = 10, q = "", withoutProducts = "" }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          q,
          withoutProducts,
        });

        return {
          url: `productVariations?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: [TAG_GET_PRODUCT_VARIATIONS_LIST],
    }),
  }),
  overrideExisting: false,
});

export const { useGetProductVariationsListQuery } = productVariationsListApi;