import { baseApi } from ".";
import { TAG_WEBHOOK } from "@/types/baseApiTags";

import type {
  IViewAllTagsResponse,
  IGetTagByIdResponse,
  ICreateTagResponse,
} from "@/types/responses/tag";

import type {
  ICreateTagRequest,
  IUpdateTagRequest,
} from "@/types/requests/tag";

const tagApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    /* -------------------- VIEW ALL TAGS -------------------- */
    viewAllTags: builder.query<IViewAllTagsResponse, void>({
      query: () => ({
        url: `/tags`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }: { id: string }) => ({
                type: TAG_WEBHOOK,
                id,
              })),
              { type: TAG_WEBHOOK, id: "LIST" },
            ]
          : [{ type: TAG_WEBHOOK, id: "LIST" }],
    }),

    /* -------------------- VIEW TAG BY ID -------------------- */
    viewTagById: builder.query<IGetTagByIdResponse, string>({
      query: (id) => ({
        url: `/tags/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [
        { type: TAG_WEBHOOK, id },
      ],
    }),

    /* -------------------- CREATE TAG -------------------- */
    createTag: builder.mutation<ICreateTagResponse, ICreateTagRequest>({
      query: (body) => ({
        url: `/tags`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result) =>
        result ? [{ type: TAG_WEBHOOK, id: "LIST" }] : [],
    }),

    /* -------------------- UPDATE TAG -------------------- */
    updateTag: builder.mutation<ICreateTagResponse, IUpdateTagRequest>({
      query: ({ id, ...body }) => ({
        url: `/tags/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, _error, { id }) =>
        result
          ? [
              { type: TAG_WEBHOOK, id },
              { type: TAG_WEBHOOK, id: "LIST" },
            ]
          : [],
    }),

    /* -------------------- DELETE TAG -------------------- */
    deleteTag: builder.mutation<void, string>({
      query: (id) => ({
        url: `/tags/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: TAG_WEBHOOK, id },
        { type: TAG_WEBHOOK, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useViewAllTagsQuery,
  useViewTagByIdQuery,
  useCreateTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
} = tagApi;

export default tagApi;
