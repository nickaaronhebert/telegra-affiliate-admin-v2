import { baseApi } from ".";
import { TAG_PATIENT_CONVERSATIONS } from "@/types/baseApiTags";
import type {
  IPatientConversation,
  IGetPatientConversationRequest,
  IJoinChannelRequest,
  IUnreadCountResponse,
} from "@/types/chat";

const patientConversationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get patient conversation by patient ID and affiliate
    getPatientConversation: builder.query<
      IPatientConversation,
      IGetPatientConversationRequest
    >({
      query: ({ patientId, affiliateId }) => ({
        url: `/patientConversations/getByPatient/${patientId}?affiliate=${affiliateId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, { patientId }) => [
        { type: TAG_PATIENT_CONVERSATIONS, id: patientId },
      ],
    }),

    // Get patient conversation by ID (pcv::userId)
    getPatientConversationById: builder.query<IPatientConversation, string>({
      query: (id) => ({
        url: `/patientConversations/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [
        { type: TAG_PATIENT_CONVERSATIONS, id },
      ],
    }),

    // Get unread message count for affiliate
    getUnreadCount: builder.query<IUnreadCountResponse, { affiliateId: string }>(
      {
        query: ({ affiliateId }) => ({
          url: `/patientConversations/actions/getMyUnreadCount?affiliate=${affiliateId}`,
          method: "GET",
        }),
        providesTags: [{ type: TAG_PATIENT_CONVERSATIONS, id: "UNREAD" }],
      }
    ),

    // Join a channel
    joinChannel: builder.mutation<void, IJoinChannelRequest>({
      query: ({ channelId }) => ({
        url: "/patientConversations/actions/joinChannel",
        method: "POST",
        body: { channelId },
      }),
      invalidatesTags: [{ type: TAG_PATIENT_CONVERSATIONS, id: "LIST" }],
    }),
  }),
});

export const {
  useGetPatientConversationQuery,
  useGetPatientConversationByIdQuery,
  useLazyGetPatientConversationByIdQuery,
  useGetUnreadCountQuery,
  useJoinChannelMutation,
} = patientConversationApi;

export default patientConversationApi;
