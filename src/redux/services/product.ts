import type { IViewAllEcommerceProductVariationsRequest } from "@/types/requests/IViewAllEcommerceProductVariations";
import { baseApi } from ".";
import type { IViewAllEcommerceProductVariationsResponse } from "@/types/responses/IViewAllEcommerceProductVariation";

import type { ICommonSearchQuery } from "@/types/requests/search";

import type {
  ICreateProductResponse,
  IGetProductById,
} from "@/types/responses/product";
import type { ICreateProductRequest } from "@/types/requests/product";
import type {
  CreateEcommerceProductResponse,
  ProductMappingRequest,
  ProductMappingResponse,
} from "@/types/responses/ecommerceProductCreation";
import type { IViewAllProductsInterface } from "@/types/responses/IViewAllProducts";
import type { EcommerceProductsResponse } from "@/types/responses/ecommerceProducts";
import { TAG_GET_PRODUCTS } from "@/types/baseApiTags";

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    viewAllEcommerceProductVariations: builder.query<
      IViewAllEcommerceProductVariationsResponse,
      IViewAllEcommerceProductVariationsRequest
    >({
      query: ({ page, limit }) => {
        return {
          url: `/ecommerceProductVariations/mapping?page=${page}&limit=${limit}`,
          method: "GET",
        };
      },
      //   providesTags: (result) => {
      //     return result
      //       ? [
      //         ...result?.result?.map(({ id }) => ({
      //           type: TAG_GET_ORDERS,
      //           id,
      //         })),
      //         { type: TAG_GET_ORDERS, id: "LIST" },
      //       ]
      //       : [{ type: TAG_GET_ORDERS, id: "LIST" }];
      //   },
    }),

    viewAllEcommerceProducts: builder.query<
      EcommerceProductsResponse,
      { page?: number; limit?: number; name?: string; productType?: string }
    >({
      query: ({ page = 1, limit = 20, name, productType }) => {
        const params = new URLSearchParams({
          limit: limit.toString(),
          page: page.toString(),
        });

        if (name) {
          params.append('name', name);
        }

        if (productType) {
          params.append('productType', productType);
        }

        return {
          url: `/ecommerceProducts?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) => {
        return result
          ? [
              ...result?.products?.map(({ id }) => ({
                type: TAG_GET_PRODUCTS,
                id,
              })),
              { type: TAG_GET_PRODUCTS, id: "LIST" },
            ]
          : [{ type: TAG_GET_PRODUCTS, id: "LIST" }];
      },
    }),

    viewEcommerceProductById: builder.query<
      any,
      string
    >({
      query: (id) => {
        return {
          url: `/ecommerceProducts/${id}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, id) => [{ type: TAG_GET_PRODUCTS, id }],
    }),

    viewAllProducts: builder.query<
      IViewAllProductsInterface,
      ICommonSearchQuery
    >({
      query: ({ page, perPage, q }) => {
        return {
          url: `/productVariations?page=${page}&limit=${perPage}&q=${q || ""}`,
          method: "GET",
        };
      },
      providesTags: (result) => {
        return result
          ? [
              ...result?.productVariations?.map(({ id }) => ({
                type: TAG_GET_PRODUCTS,
                id,
              })),
              { type: TAG_GET_PRODUCTS, id: "LIST" },
            ]
          : [{ type: TAG_GET_PRODUCTS, id: "LIST" }];
      },
    }),

    viewProductById: builder.query<IGetProductById, string>({
      query: (id) => {
        return {
          url: `/productVariations/${id}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, id) => [{ type: TAG_GET_PRODUCTS, id }],
    }),

    createProduct: builder.mutation<
      ICreateProductResponse,
      ICreateProductRequest
    >({
      query: (body) => {
        return {
          url: `/productVariations`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: (result) =>
        result ? [{ type: TAG_GET_PRODUCTS, id: "LIST" }] : [],
    }),

    createEcommerceProduct: builder.mutation<
      CreateEcommerceProductResponse,
      any
    >({
      query: (body) => {
        return {
          url: `/ecommerceProducts`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: (result) =>
        result ? [{ type: TAG_GET_PRODUCTS, id: "LIST" }] : [],
    }),

    createProductMapping: builder.mutation<
      ProductMappingResponse,
      ProductMappingRequest
    >({
      query: (body) => {
        return {
          url: `/ecommerceProductVariations/mapping`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: (result) =>
        result ? [{ type: TAG_GET_PRODUCTS, id: "LIST" }] : [],
    }),

    updateEcommerceProduct: builder.mutation<
      any,
      { id: string; data: any }
    >({
      query: ({ id, data }) => {
        return {
          url: `/ecommerceProducts/${id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: (result, _error, { id }) =>
        result ? [
          { type: TAG_GET_PRODUCTS, id: "LIST" },
          { type: TAG_GET_PRODUCTS, id },
        ] : [],
    }),
  }),
});

export const {
  useViewAllEcommerceProductVariationsQuery,
  useViewAllEcommerceProductsQuery,
  useViewEcommerceProductByIdQuery,
  useViewAllProductsQuery,
  useViewProductByIdQuery,
  useCreateProductMutation,
  useCreateEcommerceProductMutation,
  useCreateProductMappingMutation,
  useUpdateEcommerceProductMutation,
  //   useViewOrderByIdQuery,
  //   useCreateOrderMutation,
} = productApi;

export default productApi;
