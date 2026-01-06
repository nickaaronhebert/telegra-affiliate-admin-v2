import { type FC } from "react";
import GroupChannelList from "@sendbird/uikit-react/GroupChannelList";

import type { AffiliateMe } from "@/redux/services/affiliate";
import type { IPatientConversation, ChannelType } from "@/types/chat";

type TChannelListProps = {
  setSelectedChannel: (channel: string) => void;
  setSelectedChannelType: (channelType: string | undefined) => void;
  affiliate: AffiliateMe | null;
  displayPatientProfileButton?: boolean;
  setSelectedPatientConversation: (
    conversation: IPatientConversation | null | undefined
  ) => void;
  setConversationLoading: (loading: boolean) => void;
  channelType: ChannelType;
  fetchPatientConversation: (userId: string) => Promise<void>;
};

const ChannelList: FC<TChannelListProps> = ({
  setSelectedChannel,
  setSelectedChannelType,
  affiliate,
  displayPatientProfileButton,
  setSelectedPatientConversation,
  setConversationLoading,
  channelType,
  fetchPatientConversation,
}) => {
  return (
    <GroupChannelList
      onChannelCreated={() => {}}
      onChannelSelect={async (channel) => {
        setSelectedChannel(channel?.url || "");
        setSelectedChannelType(channel?.customType);

        if (displayPatientProfileButton) {
          setSelectedPatientConversation(null);
          setConversationLoading(true);
          const patientMember = channel?.members.find((member) =>
            member.userId.includes("pcv::")
          );
          if (patientMember) {
            await fetchPatientConversation(patientMember.userId);
          } else {
            setConversationLoading(false);
          }
        }
      }}
      channelListQueryParams={{
        includeEmpty: true,
        limit: 100,
        customTypesFilter: affiliate?.affiliateChatSystemEnabledChats?.length
          ? channelType === "all"
            ? affiliate?.affiliateChatSystemEnabledChats
            : [channelType]
          : [""],
      }}
      disableAutoSelect
      allowProfileEdit={false}
      renderHeader={() => <></>}
    />
  );
};

export default ChannelList;
