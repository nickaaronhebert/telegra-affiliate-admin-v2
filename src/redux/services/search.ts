import { baseApi } from ".";
import type { IGlobalSearchResponse } from "@/types/responses/search";

const searchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    globalSearch: builder.query<IGlobalSearchResponse, string>({
      query: (searchQuery) => ({
        url: `/search`,
        method: "GET",
        params: {
          q: searchQuery,
        },
      }),
    }),
  }),
});

export const { useGlobalSearchQuery, useLazyGlobalSearchQuery } = searchApi;
export default searchApi;
