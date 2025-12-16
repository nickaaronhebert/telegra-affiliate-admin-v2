import { baseApi } from "./index";
import { TAG_GET_QUESTIONNAIRES } from "@/types/baseApiTags";
import type {

  GetQuestionnairesRequest,
  Questionnaire,
} from "@/types/responses/questionnaire";

export const questionnaireApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getQuestionnaires: builder.query<
      Questionnaire[],
      GetQuestionnairesRequest
    >({
      query: ({ page = 1, limit = 100, q }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        if (q && q.trim()) {
          params.append("q", q.trim());
        }

        return {
          url: `questionnaires?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response: Questionnaire[]) => {
        // The API returns a direct array, so we return it as-is
        return response || [];
      },
      providesTags: [TAG_GET_QUESTIONNAIRES],
    }),
  }),
  overrideExisting: false,
});

export const { useGetQuestionnairesQuery } = questionnaireApi;