import { baseApi } from ".";

interface IViewAllStatesResponse {
  id: string;
  name: string;
  isSupported: boolean;
  abbreviation: string;
  createdAT: string;
  updated: string;
}
const statesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    viewAllStates: builder.query<IViewAllStatesResponse[], void>({
      query: () => {
        return {
          url: `/states`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useViewAllStatesQuery } = statesApi;

export default statesApi;
