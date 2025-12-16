import type { ICommonSearchQuery } from "@/types/requests/search";
import { baseApi } from ".";
import type {
  ICreateSubscriptionResponse,
  IGetSubscriptionById,
  IViewAllSubscriptionsResponse,
} from "@/types/responses/subscription";
import type { ICreateSubscriptionRequest } from "@/types/requests/subscription";
import { TAG_GET_SUBSCRIPTIONS } from "@/types/baseApiTags";

const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    viewAllSubscriptions: builder.query<IViewAllSubscriptionsResponse, ICommonSearchQuery>({
      query: ({ page, perPage, q }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: perPage.toString(),
        });
        
        if (q) {
          params.append('q', q);
        }

        return {
          url: `/ecommerceSubscriptions?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) => {
        return result
          ? [
            ...result?.result?.map(({ id }) => ({
              type: TAG_GET_SUBSCRIPTIONS,
              id,
            })),
            { type: TAG_GET_SUBSCRIPTIONS, id: "LIST" },
          ]
          : [{ type: TAG_GET_SUBSCRIPTIONS, id: "LIST" }];
      },
    }),

    viewSubscriptionById: builder.query<IGetSubscriptionById, string>({
      query: (id) => {
        return {
          url: `/ecommerceSubscriptions/${id}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, id) => [{ type: TAG_GET_SUBSCRIPTIONS, id }],
    }),

    createSubscription: builder.mutation<ICreateSubscriptionResponse, ICreateSubscriptionRequest>({
      query: (body) => {
        return {
          url: `/ecommerceSubscriptions`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: (result) =>
        result ? [{ type: TAG_GET_SUBSCRIPTIONS, id: "LIST" }] : [],
    }),

  }),
});

export const {
  useViewAllSubscriptionsQuery,
  useViewSubscriptionByIdQuery,
  useCreateSubscriptionMutation,
} = subscriptionApi;

export default subscriptionApi;