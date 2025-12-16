import { baseApi } from ".";
import { TAG_GET_STATES } from "@/types/baseApiTags";

export interface State {
  _id: string;
  name: string;
  abbreviation: string;
  isSupported: boolean;
  minimumVisitType: string;
  deleted: boolean;
  id: string;
  createdAt: string;
  updatedAt: string;
}

const statesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStates: builder.query<State[], void>({
      query: () => ({
        url: "/states",
        method: "GET",
      }),
      providesTags: [{ type: TAG_GET_STATES, id: "LIST" }],
    }),
  }),
});

export const { useGetStatesQuery } = statesApi;

export default statesApi;