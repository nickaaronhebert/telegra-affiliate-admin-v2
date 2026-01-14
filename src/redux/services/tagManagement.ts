import { baseApi } from ".";
import { TAG_WEBHOOK, TAG_GET_TAGS, TAG_GET_PRODUCTS, TAG_GET_JOURNEYS } from "@/types/baseApiTags";

import type {
  IViewAllTagsResponse,
  IGetTagByIdResponse,
  ICreateTagResponse,
  ICompactTagsResponse,
  IAssignTagsResponse,
} from "@/types/responses/tag";

import type {
  ICreateTagRequest,
  IUpdateTagRequest,
  IGetCompactTagsRequest,
  IAssignTagsRequest,
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

    /* -------------------- GET COMPACT TAGS FOR TARGET MODEL -------------------- */
    getCompactTags: builder.query<ICompactTagsResponse, IGetCompactTagsRequest>({
      query: ({ targetModel, mode = "compact" }) => ({
        url: `/tags?targetModel=${targetModel}&mode=${mode}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: TAG_GET_TAGS,
                id,
              })),
              { type: TAG_GET_TAGS, id: "COMPACT_LIST" },
            ]
          : [{ type: TAG_GET_TAGS, id: "COMPACT_LIST" }],
    }),

    /* -------------------- ASSIGN TAGS TO TARGET -------------------- */
    assignTags: builder.mutation<IAssignTagsResponse, IAssignTagsRequest>({
      query: ({ targetModel, targetId, tagIds }) => ({
        url: `/tags/${targetModel}/${targetId}`,
        method: "POST",
        body: { tagIds },
      }),
      invalidatesTags: () => [
        { type: TAG_GET_PRODUCTS, id: "LIST" },
        { type: TAG_GET_JOURNEYS, id: "LIST" },
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
  useGetCompactTagsQuery,
  useAssignTagsMutation,
} = tagApi;

export default tagApi;
