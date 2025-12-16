import type { ICommonSearchQuery } from "@/types/requests/search";
import { baseApi } from ".";
import type { ICreateOrderResponse } from "@/types/responses/order";
import type { ICreateOrderRequest } from "@/types/requests/order";
import type { IViewAllOrderInterface } from "@/types/responses/IViewAllOrder";
import { TAG_GET_ORDERS } from "@/types/baseApiTags";
import type { IViewOrderDetailsResponse } from "@/types/responses/IViewOrderDetails";
import type { ICancelOrderResponse } from "@/types/responses/ICancelOrder";
import type { IEditOrderResponse } from "@/types/responses/IEditOrder";

const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    viewAllOrders: builder.query<IViewAllOrderInterface, ICommonSearchQuery>({
      query: ({ page, perPage, orderid, status, patient }) => {
        const statusQuery = status ? `&status=${status}` : "";
        const orderIdQuery = orderid ? `&orderid=${orderid}` : "";
        const patientIdQuery = patient ? `&patient=${patient}` : "";
        return {
          url: `/ecommerceOrders?page=${page}&limit=${perPage}${orderIdQuery}${statusQuery}${patientIdQuery}`,
          method: "GET",
        };
      },
      providesTags: (result) => {
        return result
          ? [
              ...result?.result?.map(({ id }) => ({
                type: TAG_GET_ORDERS,
                id,
              })),
              { type: TAG_GET_ORDERS, id: "LIST" },
            ]
          : [{ type: TAG_GET_ORDERS, id: "LIST" }];
      },
    }),

    viewOrderById: builder.query<IViewOrderDetailsResponse, string>({
      query: (id) => {
        return {
          url: `/ecommerceOrders/${id}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, id) => [{ type: TAG_GET_ORDERS, id }],
    }),

    editOrderById: builder.mutation<{ message: string }, IEditOrderResponse>({
      query: ({ id, ...body }) => {
        return {
          url: `/ecommerceOrders/${id}`,
          method: "PUT",
          body,
        };
      },

      invalidatesTags: (result, _error, arg) =>
        result ? [{ type: TAG_GET_ORDERS, id: arg.id }] : [],
    }),

    createOrder: builder.mutation<ICreateOrderResponse, ICreateOrderRequest>({
      query: (body) => {
        return {
          url: `/ecommerceOrders`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: (result) =>
        result ? [{ type: TAG_GET_ORDERS, id: "LIST" }] : [],
    }),

    cancelOrder: builder.mutation<ICancelOrderResponse, string>({
      query: (id) => {
        return {
          url: `/ecommerceOrders/${id}/cancel`,
          method: "PATCH",
        };
      },

      invalidatesTags: (result, _error, id) =>
        result ? [{ type: TAG_GET_ORDERS, id: id }] : [],
      // invalidatesTags: (_result, _error, id) =>
      //   result ? [{ type: TAG_GET_ORDERS, id: "LIST" }] : [],
    }),
  }),
});

export const {
  useViewAllOrdersQuery,
  useViewOrderByIdQuery,
  useCreateOrderMutation,
  useCancelOrderMutation,
  useEditOrderByIdMutation,
} = orderApi;

export default orderApi;
