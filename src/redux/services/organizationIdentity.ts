import { baseApi } from ".";
import { TAG_AFFILIATE_DETAILS, TAG_GET_COMMUNICATION_TEMPLATES } from "@/types/baseApiTags";
import type {
  IGetAffiliateDetailsResponse,
  IUpdateAffiliateDetailsResponse,
} from "@/types/responses/organizationIdentity";
import type { IUpdateAffiliateDetailsRequest } from "@/types/requests/organizationIdentity";
import type { IViewAllCommunicationTemplatesResponse } from "@/types/responses/communicationTemplates";

const organizationIdentityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* -------------------- GET AFFILIATE DETAILS -------------------- */
    getAffiliateDetails: builder.query<IGetAffiliateDetailsResponse, void>({
      query: () => ({
        url: `/affiliates/me`,
        method: "GET",
      }),
      providesTags: [TAG_AFFILIATE_DETAILS],
    }),

    /* -------------------- UPDATE AFFILIATE DETAILS -------------------- */
    updateAffiliateDetails: builder.mutation<
      IUpdateAffiliateDetailsResponse,
      IUpdateAffiliateDetailsRequest
    >({
      query: (body) => ({
        url: `/affiliates/me`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [TAG_AFFILIATE_DETAILS],
    }),

    /* -------------------- GET COMMUNICATION TEMPLATES -------------------- */
    getCommunicationTemplatesAffiliate: builder.query<
      IViewAllCommunicationTemplatesResponse,
      void
    >({
      query: () => ({
        url: `/communicationTemplates`,
        params: {
          communicationLevel: "affiliate",
        },
        method: "GET",
      }),
      providesTags: [TAG_GET_COMMUNICATION_TEMPLATES],
    }),
  }),
});

export const {
  useGetAffiliateDetailsQuery,
  useUpdateAffiliateDetailsMutation,
  useGetCommunicationTemplatesAffiliateQuery,
} = organizationIdentityApi;

export default organizationIdentityApi;

