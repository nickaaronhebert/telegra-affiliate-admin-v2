import { baseApi } from ".";
import type {
  IWebhookRequest,
  IUpdateWebhookRequest,
} from "@/types/requests/webhook";
import type {
  IWebhookResponse,
  IGetWebhooksResponse,
  IWebhookEvent,
} from "@/types/responses/webhook";
import { TAG_WEBHOOK } from "@/types/baseApiTags";

/**
 * Ensure "Webhooks" exists in baseApi.tagTypes
 */

export const webhooksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* ---------- GET WEBHOOKS LIST ---------- */
    getWebhooksList: builder.query<IGetWebhooksResponse, void>({
      query: () => ({
        url: "/webhooks",
        method: "GET",
      }),
      providesTags: (result) => {
        const webhooks = result?.webhooks ?? result?.result ?? [];

        return [
          ...webhooks.map((w: any) => ({
            type: TAG_WEBHOOK,
            id: w.id,
          })),
          { type: TAG_WEBHOOK, id: "LIST" },
        ];
      },
    }),

    /* ---------- GET WEBHOOK EVENTS DICTIONARY ---------- */
    getWebhookEventsDictionary: builder.query<IWebhookEvent[], void>({
      query: () => ({
        url: "/webhooks/actions/getDictionary",
        method: "GET",
      }),
    }),

    /* ---------- CREATE ---------- */
    createWebhook: builder.mutation<IWebhookResponse, IWebhookRequest>({
      query: (body) => ({
        url: "/webhooks",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: TAG_WEBHOOK, id: "LIST" }],
    }),

    /* ---------- UPDATE ---------- */
    updateWebhook: builder.mutation<IWebhookResponse, IUpdateWebhookRequest>({
      query: ({ id, payload }) => ({
        url: `/webhooks/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: TAG_WEBHOOK, id },
        { type: TAG_WEBHOOK, id: "LIST" },
      ],
    }),

    /* ---------- DELETE ---------- */
    deleteWebhook: builder.mutation<void, string>({
      query: (id) => ({
        url: `/webhooks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: TAG_WEBHOOK, id },
        { type: TAG_WEBHOOK, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetWebhooksListQuery,
  useGetWebhookEventsDictionaryQuery,
  useCreateWebhookMutation,
  useUpdateWebhookMutation,
  useDeleteWebhookMutation,
} = webhooksApi;
