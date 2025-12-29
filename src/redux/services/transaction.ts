import { baseApi } from "@/redux/services";
import type { Transaction } from "@/types/responses/transaction";
import { TAG_GET_ENCOUNTER } from "@/types/baseApiTags";

export const transactionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTransactionById: builder.query<Transaction, string>({
      query: (transactionId) => {
        return {
          url: `/transactions/${transactionId}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, id) => [
        { type: TAG_GET_ENCOUNTER, id },
      ],
    }),
  }),
});

export const { useGetTransactionByIdQuery, useLazyGetTransactionByIdQuery } =
  transactionApi;

export default transactionApi;
