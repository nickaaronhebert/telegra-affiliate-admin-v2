import { baseApi } from "@/redux/services";
import type { EncounterDetail } from "@/types/responses/encounter";
import type {
  Transaction,
  PaymentMethodDetails,
} from "@/types/responses/transaction";
import { TAG_GET_ENCOUNTER } from "@/types/baseApiTags";

export type EncounterStatus =
  | "started"
  | "requires_affiliate_review"
  | "requires_order_submission"
  | "requires_waiting_room_egress"
  | "requires_provider_review"
  | "requires_order_processing"
  | "delayed"
  | "requires_admin_review"
  | "requires_prerequisite_completion"
  | "cancelled"
  | "completed";

interface IViewAllEncountersRequest {
  page?: number;
  limit?: number;
  product?: string | null;
  assignedAffiliateAdmin?: string | null;
  tags?: string | null;
  dateFrom?: string;
  dateTo?: string;
  status: string;
}

export interface EncounterList {
  id: string;
  status: string;
  orderNumber: string;
  patient: {
    _id: string;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
  };
  productVariations: {
    quantity: number;
    productVariation: {
      _id: string;
      description: string;
      strength: string;
      product: {
        _id: string;
        title: string;
      };
    };
  }[];
  createdAt: string;
  updatedAt: string;
}
interface IViewAllEncountersResponse {
  count: number;
  result: EncounterList[];
}

export const encounterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    viewAllEncounters: builder.query<
      IViewAllEncountersResponse,
      IViewAllEncountersRequest
    >({
      query: ({
        page = 1,
        limit = 15,
        product,
        assignedAffiliateAdmin,
        tags,
        dateFrom,
        dateTo,
        status,
      }) => {
        const productQuery = product ? `&product=${product}` : "";
        const adminQuery = assignedAffiliateAdmin
          ? `&assignedAffiliateAdmin=${assignedAffiliateAdmin}`
          : "";
        const tagsQuery = tags ? `&tags=${tags}` : "";
        const dateFromQuery = dateFrom ? `&dateFrom=${dateFrom}` : "";
        const dateToQuery = dateTo ? `&dateTo=${dateTo}` : "";
        const statusQuery = status ? `&status=${status}` : "";

        return {
          url: `/orders/affiliate?page=${page}&limit=${limit}${productQuery}${adminQuery}${tagsQuery}${dateFromQuery}${dateToQuery}${statusQuery}`,
          method: "GET",
        };
      },

      providesTags: (result) => {
        return result
          ? [
              ...result?.result?.map(({ id }) => ({
                type: TAG_GET_ENCOUNTER,
                id,
              })),
              { type: TAG_GET_ENCOUNTER, id: "LIST" },
            ]
          : [{ type: TAG_GET_ENCOUNTER, id: "LIST" }];
      },
    }),

    viewEncounterById: builder.query<EncounterDetail, string>({
      query: (id) => {
        return {
          url: `/orders/${id}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, id) => [{ type: TAG_GET_ENCOUNTER, id }],
    }),

    expediteEncounter: builder.mutation<
      any,
      {
        id: string;
        token: string;
        expedited: boolean;
      }
    >({
      query: ({ id, token, expedited }) => {
        return {
          url: `/orders/${id}/actions/expedite?access_token=${token}`,
          method: "PUT",
          body: {
            expedited,
          },
        };
      },
      invalidatesTags: (_result, _error, data) => [
        { type: TAG_GET_ENCOUNTER, id: data.id },
      ],
    }),

    cancelEncounter: builder.mutation<any, string>({
      query: (id) => {
        return {
          url: `/orders/${id}/actions/cancel`,
          method: "POST",
        };
      },
      invalidatesTags: (_result, _error, id) => [
        { type: TAG_GET_ENCOUNTER, id: id },
      ],
    }),

    getEncounterTransaction: builder.query<Transaction, string>({
      query: (transactionId) => {
        return {
          url: `/transactions/${transactionId}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, id) => [{ type: TAG_GET_ENCOUNTER, id }],
    }),

    getPaymentMethodDetails: builder.query<
      PaymentMethodDetails,
      { paymentId: string; patientId: string }
    >({
      query: ({ paymentId, patientId }) => {
        return {
          url: `/billingDetails/actions/getPaymentMethod/${paymentId}?id=${paymentId}&patient=${patientId}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, { paymentId }) => [
        { type: TAG_GET_ENCOUNTER, id: paymentId },
      ],
    }),
  }),
});

export const {
  useViewAllEncountersQuery,
  useViewEncounterByIdQuery,
  useLazyViewEncounterByIdQuery,
  useExpediteEncounterMutation,
  useCancelEncounterMutation,
  useGetEncounterTransactionQuery,
  useLazyGetEncounterTransactionQuery,
  useGetPaymentMethodDetailsQuery,
} = encounterApi;

export default encounterApi;
