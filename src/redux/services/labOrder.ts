import type { ICommonSearchQuery } from "@/types/requests/search";
import { baseApi } from ".";

import type { IViewLabOrdersResponse } from "@/types/responses/IViewLabOrdes";
import { TAG_GET_LAB_ORDER } from "@/types/baseApiTags";
import type { IViewLabOrderDetails } from "@/types/responses/IViewLabOrderDetails";

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

    viewLabOrderDetails: builder.query<IViewLabOrderDetails, string>({
      query: (id) => {
        return {
          url: `/labOrders/${id}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, id) => [{ type: TAG_GET_LAB_ORDER, id }],
    }),
  }),
});

export const { useViewAllLabOrdersQuery, useViewLabOrderDetailsQuery } =
  labOrderApi;

export default labOrderApi;
