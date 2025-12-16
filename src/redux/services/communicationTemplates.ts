import { baseApi } from "./index";
import { TAG_GET_COMMUNICATION_TEMPLATES } from "@/types/baseApiTags";
import type { ICommunicationTemplate } from '@/types/communicationTemplates';

export const communicationTemplatesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCommunicationTemplates: builder.query<ICommunicationTemplate[], void>({
      query: () => ({
        url: "/communication-templates",
        method: "GET",
      }),
      providesTags: [TAG_GET_COMMUNICATION_TEMPLATES],
    }),
  }),
});

export const { useGetCommunicationTemplatesQuery } = communicationTemplatesApi;