import { baseApi } from "@/redux/services";

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
      //   providesTags: (result) => {
      //     return result
      //       ? [
      //           ...result.map(({ id }) => ({
      //             type: TAG_GET_TEAM_MANAGEMENT,
      //             id,
      //           })),
      //           { type: TAG_GET_TEAM_MANAGEMENT, id: "LIST" },
      //         ]
      //       : [{ type: TAG_GET_TEAM_MANAGEMENT, id: "LIST" }];
      //   },
    }),

    // addAffiliateAdmin: builder.mutation<any, AddAffiliateAdminPaylaod>({
    //   query: (body) => {
    //     return {
    //       url: "/users",
    //       method: "POST",
    //       body,
    //     };
    //   },
    //   invalidatesTags: [{ type: TAG_GET_TEAM_MANAGEMENT, id: "LIST" }],
    // }),

    // updateTeamManagement: builder.mutation<any, UpdateAffiliateAdminPayload>({
    //   query: (body) => {
    //     return {
    //       url: `/users/${body.id}`,
    //       method: "PUT",
    //       body,
    //     };
    //   },

    //   invalidatesTags: (_result, _error, data) => [
    //     { type: TAG_GET_TEAM_MANAGEMENT, id: data.id },
    //   ],
    // }),
  }),
});

export const {
  useViewAllEncountersQuery,
  //   useViewAffiliateAdminQuery,
  //   useAddAffiliateAdminMutation,
  //   useUpdateTeamManagementMutation,
} = encounterApi;

export default encounterApi;
