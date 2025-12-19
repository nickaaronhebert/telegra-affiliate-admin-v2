import { TAG_GET_LAB_ORDER, TAG_GET_TEMPLATES } from "@/types/baseApiTags";
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

export interface UserNotesTemplateResponse {
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

interface AddNotesPayload {
  relatedEntityModel: string;
  isPrivate: boolean;
  subject: string;
  noteType: string;
  content: {
    standardText: string;
  };
  relatedEntity: string;
}

interface UpdateNoteTemplatePayload {
  id: string;
  noteTitle: string;
  noteType: string;
  noteContent: {
    standardText: string;
  };
}

interface CreateTemplatePayload {
  noteTitle: string;
  noteType: string;
  noteContent: {
    standardText: string;
  };
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

    createNoteTemplate: builder.mutation<any, CreateTemplatePayload>({
      query: (body) => {
        return {
          url: "/noteTemplates",
          method: "POST",
          body,
        };
      },
      invalidatesTags: [{ type: TAG_GET_TEMPLATES, id: "LIST" }],
    }),

    updateNoteTemplate: builder.mutation<any, UpdateNoteTemplatePayload>({
      query: (body) => {
        return {
          url: `/noteTemplates/${body.id}`,
          method: "PUT",
          body,
        };
      },

      invalidatesTags: (_result, _error, data) => [
        { type: TAG_GET_TEMPLATES, id: data.id },
      ],
    }),

    addNotes: builder.mutation<any, AddNotesPayload>({
      query: (body) => {
        return {
          url: "/notes",
          method: "POST",
          body,
        };
      },
      invalidatesTags: (_result, _error, data) => [
        { type: TAG_GET_LAB_ORDER, id: data.relatedEntity },
      ],
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

export const {
  useDeleteNoteMutation,
  useViewUserNotesTemplatesQuery,
  useAddNotesMutation,
  useUpdateNoteTemplateMutation,
  useCreateNoteTemplateMutation,
} = notesApi;

export default notesApi;
