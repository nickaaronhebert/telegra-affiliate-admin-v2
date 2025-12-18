import { TAG_GET_TEMPLATES } from "@/types/baseApiTags";
import { baseApi } from "./index";

export interface Note {
  _id: string;
  id: string;
  subject: string;
  noteType: string;
  content: {
    standardText: string;
  };
  owner: {
    _id: string;
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    role: string;
  };
  patient: string;
  relatedEntityModel: string;
  relatedEntity: string;
  isPrivate: boolean;
  patientRelated: boolean;
  access: string[];
  deleted: boolean;
  keywords: string[];
  createdAt: string;
  updatedAt: string;
}

export interface NotesResponse {
  data: Note[];
  total: number;
}

interface UserNotesTemplateResponse {
  id: string;
  noteTitle: string;
  noteType: string;
  noteContent: {
    standardText: string;
  };
  owner: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
}
export const notesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    viewUserNotesTemplates: builder.query<UserNotesTemplateResponse[], void>({
      query: () => {
        return {
          url: `/noteTemplates/getByUser`,
          method: "GET",
        };
      },
      providesTags: (result) => {
        return result
          ? [
              ...result.map(({ id }) => ({
                type: TAG_GET_TEMPLATES,
                id,
              })),
              { type: TAG_GET_TEMPLATES, id: "LIST" },
            ]
          : [{ type: TAG_GET_TEMPLATES, id: "LIST" }];
      },
    }),

    deleteNote: builder.mutation<void, string>({
      query: (noteId) => ({
        url: `/notes/${noteId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notes"],
    }),
  }),
});

export const { useDeleteNoteMutation, useViewUserNotesTemplatesQuery } =
  notesApi;

export default notesApi;
