import type { ICommonSearchQuery } from "@/types/requests/search";
import { baseApi } from ".";

import type { IViewLabOrdersResponse } from "@/types/responses/IViewLabOrdes";
import { TAG_GET_LAB_ORDER, TAG_GET_PATIENTS } from "@/types/baseApiTags";
import type { IViewLabOrderDetails } from "@/types/responses/IViewLabOrderDetails";
import type { LabPanelsDetails } from "@/types/responses/IViewLabPanelsResponse";
import type { IEditLabOrderRequest } from "@/types/requests/IEditLabOrder";

export interface LabInfo {
  id: string;
  name: string;
  key?: string;
  webhookHostname?: string;
  orderIdentifierField?: string;
}

export interface LabPanel {
  id: string;
  labTests: any[];
  lab: string;
  title: string;
  description?: string;
  biomarkers: any[];
  cost: number;
  additionalCost: number;
  totalCost: number;
  labPanelIdentifier?: string;
}

export interface CreatePatientLabOrderRequest {
  patient: string;
  address: {
    billing: {
      address1: string;
      address2?: string;
      city: string;
      state: string;
      zipcode: string;
    };
    shipping: {
      address1: string;
      address2?: string;
      city: string;
      state: string;
      zipcode: string;
    };
  };
  affiliate?: string;
  lab: string;
  labPanels: string[];
  labTests?: any[];
  immediateProcessing?: boolean;
  createOrderAfterResults?: boolean;
  afterResultsOrderProductVariations?: Array<{
    productVariation: string;
    quantity: number;
  }>;
  project?: string;
  isAddressInSelect?: boolean;
}

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

    getAllLabs: builder.query<LabInfo[], void>({
      query: () => ({
        url: "/labs",
        method: "GET",
      }),
    }),

    getLabPanels: builder.query<LabPanel[], string>({
      query: (labId) => ({
        url: `/labPanels?lab=${labId}`,
        method: "GET",
      }),
    }),

    createPatientLabOrder: builder.mutation<
      { data: any },
      CreatePatientLabOrderRequest
    >({
      query: (body) => ({
        url: "/labOrders",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, _error, body) =>
        result ? [
          { type: TAG_GET_LAB_ORDER, id: "LIST" },
          { type: TAG_GET_PATIENTS, id: "LIST" },
          { type: TAG_GET_PATIENTS, id: body.patient },
          { type: TAG_GET_PATIENTS, id: `${body.patient}-orders` },
          { type: TAG_GET_PATIENTS, id: `${body.patient}-payment` },
        ] : [],
    }),
  }),
});

export const {
  useViewAllLabOrdersQuery,
  useViewLabOrderDetailsQuery,
  useViewAllLabPanelsQuery,
  useEditLabOrderMutation,
  useGetAllLabsQuery,
  useGetLabPanelsQuery,
  useCreatePatientLabOrderMutation,
} = labOrderApi;

export default labOrderApi;
