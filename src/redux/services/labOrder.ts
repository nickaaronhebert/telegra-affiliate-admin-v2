import type { ICommonSearchQuery } from "@/types/requests/search";
import { baseApi } from ".";

import type { IViewLabOrdersResponse } from "@/types/responses/IViewLabOrdes";
import { TAG_GET_LAB_ORDER } from "@/types/baseApiTags";
import type { IViewLabOrderDetails } from "@/types/responses/IViewLabOrderDetails";
import type { LabPanelsDetails } from "@/types/responses/IViewLabPanelsResponse";
import type { IEditLabOrderRequest } from "@/types/requests/IEditLabOrder";

const labOrderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    viewAllLabOrders: builder.query<IViewLabOrdersResponse, ICommonSearchQuery>(
      {
        query: ({ page = 1, perPage = 1, status = "pending" }) => {
          return {
            url: `/labOrders?page=${page}&limit=${perPage}&status=${status}`,
            method: "GET",
          };
        },
        providesTags: (result) => {
          return result
            ? [
                ...result?.result?.map(({ id }) => ({
                  type: TAG_GET_LAB_ORDER,
                  id,
                })),
                { type: TAG_GET_LAB_ORDER, id: "LIST" },
              ]
            : [{ type: TAG_GET_LAB_ORDER, id: "LIST" }];
        },
      }
    ),

    viewAllLabPanels: builder.query<LabPanelsDetails, string>({
      query: (lab = "") => {
        return {
          url: `/labPanels?lab=${lab}`,
          method: "GET",
        };
      },
      // providesTags: (result) => {
      //   return result
      //     ? [
      //         ...result?.result?.map(({ id }) => ({
      //           type: TAG_GET_LAB_ORDER,
      //           id,
      //         })),
      //         { type: TAG_GET_LAB_ORDER, id: "LIST" },
      //       ]
      //     : [{ type: TAG_GET_LAB_ORDER, id: "LIST" }];
      // },
    }),

    viewLabOrderDetails: builder.query<IViewLabOrderDetails, string>({
      query: (id) => {
        return {
          url: `/labOrders/${id}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, id) => [{ type: TAG_GET_LAB_ORDER, id }],
    }),

    editLabOrder: builder.mutation<any, IEditLabOrderRequest>({
      query: (body) => {
        return {
          url: `/labOrders/${body.labOrderId}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: (_result, _error, data) => [
        { type: TAG_GET_LAB_ORDER, id: data.labOrderId },
      ],
    }),
  }),
});

export const {
  useViewAllLabOrdersQuery,
  useViewLabOrderDetailsQuery,
  useViewAllLabPanelsQuery,
  useEditLabOrderMutation,
} = labOrderApi;

export default labOrderApi;
