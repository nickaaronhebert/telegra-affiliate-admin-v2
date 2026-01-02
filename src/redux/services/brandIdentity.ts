import { baseApi } from ".";
import { TAG_BRAND_IDENTITY } from "@/types/baseApiTags";
import type {
  IGetBrandIdentityResponse,
  IUpdateBrandIdentityRequest,
  IUpdateBrandIdentityResponse,
  IGetFrontendConfigurationResponse,
  IUploadLogoRequest,
  IUploadLogoResponse,
} from "@/types/responses/brandIdentity";

const brandIdentityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* -------------------- GET BRAND IDENTITY -------------------- */
    getBrandIdentity: builder.query<IGetBrandIdentityResponse, void>({
      query: () => ({
        url: `/settings/brandIdentity`,
        method: "GET",
      }),
      providesTags: [TAG_BRAND_IDENTITY],
    }),

    /* -------------------- UPDATE BRAND IDENTITY -------------------- */
    updateBrandIdentity: builder.mutation<
      IUpdateBrandIdentityResponse,
      IUpdateBrandIdentityRequest
    >({
      query: (body) => ({
        url: `/settings/brandIdentity`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [TAG_BRAND_IDENTITY],
    }),

    /* -------------------- GET FRONTEND CONFIGURATION -------------------- */
    getFrontendConfiguration: builder.query<IGetFrontendConfigurationResponse, void>({
      query: () => ({
        url: `/settings/brandIdentity/frontendConfiguration`,
        method: "GET",
      }),
    }),

    /* -------------------- UPLOAD LOGO -------------------- */
    uploadLogo: builder.mutation<IUploadLogoResponse, IUploadLogoRequest>({
      query: (body) => ({
        url: `/affiliates/me`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [TAG_BRAND_IDENTITY],
    }),
  }),
});

export const {
  useGetBrandIdentityQuery,
  useUpdateBrandIdentityMutation,
  useLazyGetFrontendConfigurationQuery,
  useUploadLogoMutation,
} = brandIdentityApi;

export default brandIdentityApi;
