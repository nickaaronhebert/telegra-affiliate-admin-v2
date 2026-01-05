import type { Patient } from "./global/commonTypes";
import type { AffiliateMe } from "@/redux/services/affiliate";

// Channel interface for SendBird channels
export interface IChannel {
  channelId: string;
  channelName: string;
  channelType: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// Patient Conversation interface
export interface IPatientConversation {
  id: string;
  affiliate: AffiliateMe | string;
  patient: Patient | string;
  participantIdentifier: string;
  participantSecondaryIdentifier: string;
  channel?: {
    channel_url: string;
  };
  channels: IChannel[];
}

// Conversation data for redux state
export interface IConversationData {
  channels: IChannel[];
}

// Channel type options
export type ChannelType = "all" | "clinical" | "billing" | "support" | "internal";

// Request types for patient conversation API
export interface IGetPatientConversationRequest {
  patientId: string;
  affiliateId: string;
}

export interface IJoinChannelRequest {
  channelId: string;
}

// Response types
export interface IUnreadCountResponse {
  unread_count: number;
}

// SendBird channel interface (for useChannels hook)
export interface SendBirdChannel {
  url: string;
  customType?: string;
  members?: Array<{ userId: string; nickname?: string }>;
}
