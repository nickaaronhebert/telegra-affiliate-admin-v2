import { baseApi } from ".";
import { TAG_GET_PRODUCTS } from "@/types/baseApiTags";
import type {
  IGetProjectsResponse,
  IGetProjectByIdResponse,
} from "@/types/responses/project";

const projectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* ---------- GET ALL PROJECTS ---------- */
    getProjects: builder.query<IGetProjectsResponse, void>({
      query: () => ({
        url: "/projects",
        method: "GET",
      }),
      providesTags: (result) => {
        const projects = result ?? [];

        return [
          ...projects.map((p: any) => ({
            type: TAG_GET_PRODUCTS,
            id: p.id,
          })),
          { type: TAG_GET_PRODUCTS, id: "LIST" },
        ];
      },
    }),

    /* ---------- GET PROJECT BY ID ---------- */
    getProjectById: builder.query<IGetProjectByIdResponse, string>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [
        { type: TAG_GET_PRODUCTS, id },
      ],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
} = projectsApi;

export default projectsApi;
