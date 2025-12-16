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

export const notesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

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
    useDeleteNoteMutation
} = notesApi;

export default notesApi;