import type { ICommonSearchQuery } from "@/types/requests/search";
import { baseApi } from ".";
import type {
  ICreateJourneyResponse,
  IGetJourneyById,
} from "@/types/responses/journey";
import type { ICreateJourneyRequest } from "@/types/requests/journey";
import type { IViewAllJourneyInterface } from "@/types/responses/IViewAllJourney";
import { TAG_GET_JOURNEYS } from "@/types/baseApiTags";

const journeyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    viewAllJourneys: builder.query<IViewAllJourneyInterface, ICommonSearchQuery>({
      query: ({ page, perPage, name }) => {
        const params = new URLSearchParams();

        params.append("page", String(page));
        params.append("limit", String(perPage));

        if (name) {
          params.append("name", name);
        }

        return {
          url: `/journeyTemplates?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) => {
        return result
          ? [
            ...result?.result?.map(({ id }) => ({
              type: TAG_GET_JOURNEYS,
              id,
            })),
            { type: TAG_GET_JOURNEYS, id: "LIST" },
          ]
          : [{ type: TAG_GET_JOURNEYS, id: "LIST" }];
      },
    }),

    viewJourneyById: builder.query<IGetJourneyById, string>({
      query: (id) => {
        return {
          url: `/journeyTemplates/${id}/affiliate`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, id) => [{ type: TAG_GET_JOURNEYS, id }],
    }),

    createJourney: builder.mutation<ICreateJourneyResponse, ICreateJourneyRequest>({
      query: (body) => {
        return {
          url: `/journeyTemplates`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: (result) =>
        result ? [{ type: TAG_GET_JOURNEYS, id: "LIST" }] : [],
    }),

    updateJourney: builder.mutation<
      ICreateJourneyResponse,
      ICreateJourneyRequest & { journeyId: string }
    >({
      query: ({ journeyId, ...body }) => {
        return {
          url: `/journeyTemplates/${journeyId}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: (result, _error, { journeyId }) =>
        result
          ? [
              { type: TAG_GET_JOURNEYS, id: journeyId },
              { type: TAG_GET_JOURNEYS, id: "LIST" },
            ]
          : [],
    }),
  }),
});

export const {
  useViewAllJourneysQuery,
  useViewJourneyByIdQuery,
  useCreateJourneyMutation,
  useUpdateJourneyMutation,
} = journeyApi;

export default journeyApi;
