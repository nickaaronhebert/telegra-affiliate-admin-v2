import { baseApi } from "@/redux/services";
import { TAG_GET_TEAM_MANAGEMENT } from "@/types/baseApiTags";

export interface AffiliateAdminDetails {
  id: string;
  name: string;
  firstName: string;
  middleName: string;
  lastName: string;
  picture: string;
  phone: string;
  role: string;
  fullName: string;
  status: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  affiliate: string;
}

interface UpdateAffiliateAdminPayload {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  status: string;
  role: string;
}

interface AddAffiliateAdminPaylaod {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  role: string;
}
export const teamManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    viewAffiliateAdmin: builder.query<AffiliateAdminDetails[], void>({
      query: () => {
        return {
          url: `/affiliates/admins`,
          method: "GET",
        };
      },
      providesTags: (result) => {
        return result
          ? [
              ...result.map(({ id }) => ({
                type: TAG_GET_TEAM_MANAGEMENT,
                id,
              })),
              { type: TAG_GET_TEAM_MANAGEMENT, id: "LIST" },
            ]
          : [{ type: TAG_GET_TEAM_MANAGEMENT, id: "LIST" }];
      },
    }),

    addAffiliateAdmin: builder.mutation<any, AddAffiliateAdminPaylaod>({
      query: (body) => {
        return {
          url: "/users",
          method: "POST",
          body,
        };
      },
      invalidatesTags: [{ type: TAG_GET_TEAM_MANAGEMENT, id: "LIST" }],
    }),

    updateTeamManagement: builder.mutation<any, UpdateAffiliateAdminPayload>({
      query: (body) => {
        return {
          url: `/users/${body.id}`,
          method: "PUT",
          body,
        };
      },

      invalidatesTags: (_result, _error, data) => [
        { type: TAG_GET_TEAM_MANAGEMENT, id: data.id },
      ],
    }),
  }),
});

export const {
  useViewAffiliateAdminQuery,
  useAddAffiliateAdminMutation,
  useUpdateTeamManagementMutation,
} = teamManagementApi;

export default teamManagementApi;
