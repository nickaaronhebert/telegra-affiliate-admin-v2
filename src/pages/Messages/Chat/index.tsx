import { type FC, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSendbirdStateContext } from "@sendbird/uikit-react";
import { GroupChannel } from "@sendbird/uikit-react/GroupChannel";
import GroupChannelList from "@sendbird/uikit-react/GroupChannelList";
import GroupChannelListHeader from "@sendbird/uikit-react/GroupChannelList/components/GroupChannelListHeader";
import GroupChannelHeader from "@sendbird/uikit-react/GroupChannel/components/GroupChannelHeader";
import { User } from "lucide-react";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";

// Redux
import { useTypedSelector } from "@/redux/store";
import { selectAffiliateData } from "@/redux/slices/affiliate";
import { selectConversationData } from "@/redux/slices/chat";
import {
  useLazyGetPatientConversationByIdQuery,
  useJoinChannelMutation,
  useGetUnreadCountQuery,
} from "@/redux/services/patientConversation";

// Hooks
import { useChannels } from "@/hooks/useChannels";

// Components
import { CustomMessage } from "./customMessage";

// Types
import type { AffiliateMe } from "@/redux/services/affiliate";
import type { IPatientConversation, ChannelType } from "@/types/chat";
import type { Patient } from "@/types/global/commonTypes";

// Constants
import { ROUTES } from "@/constants/routes";

// Toast notifications - using sonner
import { toast } from "sonner";

// Import Sendbird styles
import "@sendbird/uikit-react/dist/index.css";

type TChatProps = {
  autoSelectChannelType?: string;
  displayJoinChannelButton?: boolean;
  displayPatientProfileButton?: boolean;
};

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

/**
 * Check if affiliate has messaging permissions for a channel type
 */
export const shouldAffiliateHaveMessagingPermissions = (
  affiliate: AffiliateMe | null | undefined,
  channelType: string
): boolean => {
  try {
    return affiliate?.affiliateChatSystemEnabledMessaging
      ? affiliate.affiliateChatSystemEnabledMessaging.includes(channelType)
      : channelType !== "clinical";
  } catch (err) {
    console.debug("[Chat] Permission check failed", err);
    return false;
  }
};

/**
 * Join Button Component
 */
const JoinButton: FC<{ handleJoinChannel: (prop: string) => void }> = ({
  handleJoinChannel,
}) => {
  return (
    <div className="mb-4 flex justify-left align-middle">
      <Button
        variant="outline"
        className="cursor-pointer"
        onClick={() => handleJoinChannel("clinical")}
      >
        Join Clinical Channel
      </Button>
    </div>
  );
};

/**
 * Channel List Component
 */
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

/**
 * Main Chat Component
 */
const ChatComponent: FC<TChatProps> = ({
  autoSelectChannelType,
  displayJoinChannelButton,
  displayPatientProfileButton,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Redux selectors
  const affiliate = useTypedSelector(selectAffiliateData);
  const conversationData = useTypedSelector(selectConversationData);

  // RTK Query hooks
  const [getPatientConversationById] = useLazyGetPatientConversationByIdQuery();
  const [joinChannel] = useJoinChannelMutation();

  // Refetch unread count when affiliate changes
  const { refetch: refetchUnreadCount } = useGetUnreadCountQuery(
    { affiliateId: affiliate?.id || "" },
    { skip: !affiliate?.id }
  );

  // Local state
  const [selectedChannel, setSelectedChannel] = useState("");
  const [selectedChannelType, setSelectedChannelType] = useState<
    string | undefined
  >("");
  const [selectedPatientConversation, setSelectedPatientConversation] =
    useState<IPatientConversation | null | undefined>();
  const [conversationLoading, setConversationLoading] = useState(false);
  const [key, setKey] = useState(0);
  const [activeTab, setActiveTab] = useState("all");

  // Sendbird
  const sb = useSendbirdStateContext()?.stores?.sdkStore?.sdk;
  const channelss = useChannels({ sb, renderKey: key });
  const channels = [...channelss, ...channelss];
  const reloadSendbird = () => {
    setKey((prev) => prev + 1);
  };

  // Fetch patient conversation using RTK lazy query
  const fetchPatientConversation = async (userId: string) => {
    try {
      const result = await getPatientConversationById(userId).unwrap();
      setSelectedPatientConversation(result);
    } catch (error) {
      setSelectedPatientConversation(null);
    } finally {
      setConversationLoading(false);
    }
  };

  const handleJoinChannel = async (channelType: string) => {
    try {
      const channelByType = conversationData?.channels.find(
        (channel) => channel.channelType === channelType
      );
      const channelId = channelByType?.channelId;

      if (channelId) {
        await joinChannel({ channelId }).unwrap();
        reloadSendbird();
        refetchUnreadCount();
      }
    } catch (error) {
      toast.error(`Can't join ${channelType} channel`);
    }
  };

  const channelIds = useMemo(() => {
    if (location.pathname !== ROUTES.MESSAGE) {
      return conversationData?.channels.map((channel) => channel.channelId);
    }
  }, [conversationData, location.pathname]);

  const isMessagePage = useMemo(() => {
    return location.pathname === ROUTES.MESSAGE;
  }, [location.pathname]);

  useEffect(() => {
    if (
      affiliate &&
      conversationData?.channels &&
      autoSelectChannelType &&
      !selectedChannel
    ) {
      const channelByType = conversationData?.channels.find(
        (channel) => channel.channelType === autoSelectChannelType
      );
      channelByType && setSelectedChannel(channelByType?.channelId);
    }
  }, [
    affiliate,
    conversationData?.channels,
    autoSelectChannelType,
    selectedChannel,
  ]);

  // Generate available tabs based on channels
  const availableTabs = useMemo(() => {
    const tabs: { value: ChannelType; label: string }[] = [
      { value: "all", label: "All" },
    ];

    if (channels.some((channel) => channel?.customType === "clinical")) {
      tabs.push({ value: "clinical", label: "Clinical" });
    }
    if (channels.some((channel) => channel?.customType === "billing")) {
      tabs.push({ value: "billing", label: "Billing" });
    }
    if (channels.some((channel) => channel?.customType === "support")) {
      tabs.push({ value: "support", label: "Support" });
    }
    if (channels.some((channel) => channel?.customType === "internal")) {
      tabs.push({ value: "internal", label: "Internal" });
    }

    return tabs;
  }, [channels]);

  return (
    <>
      {displayJoinChannelButton &&
        affiliate?.affiliateChatSystemEnabledChats?.includes("clinical") &&
        !channels.some((channel) => channel?.customType === "clinical") && (
          <JoinButton handleJoinChannel={handleJoinChannel} />
        )}
      <div className="flex h-[calc(100vh-200px)] min-h-[500px] border rounded-lg overflow-hidden">
        {/* Channel List Section */}
        {isMessagePage ? (
          <div className="w-81 border-r flex flex-col">
            <GroupChannelListHeader renderRight={() => <></>} />
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col"
            >
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                {availableTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent cursor-pointer"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {availableTabs.map((tab) => (
                <TabsContent
                  key={tab.value}
                  value={tab.value}
                  className="flex-1 mt-0 overflow-auto"
                >
                  <ChannelList
                    setSelectedChannel={setSelectedChannel}
                    setSelectedChannelType={setSelectedChannelType}
                    affiliate={affiliate}
                    displayPatientProfileButton={displayPatientProfileButton}
                    setSelectedPatientConversation={
                      setSelectedPatientConversation
                    }
                    setConversationLoading={setConversationLoading}
                    channelType={tab.value}
                    fetchPatientConversation={fetchPatientConversation}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        ) : (
          <div className="w-80 border-r">
            <GroupChannelList
              onChannelCreated={() => {}}
              onChannelSelect={async (channel) => {
                setSelectedChannel(channel?.url || "");
                setSelectedChannelType(channel?.customType);
                refetchUnreadCount();

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
                customTypesFilter: affiliate?.affiliateChatSystemEnabledChats
                  ?.length
                  ? affiliate?.affiliateChatSystemEnabledChats
                  : [""],
                channelUrlsFilter: channelIds,
              }}
              disableAutoSelect
              allowProfileEdit={false}
              renderHeader={() => (
                <GroupChannelListHeader renderRight={() => <></>} />
              )}
            />
          </div>
        )}

        {/* Chat Section */}
        <div className="flex-1">
          <GroupChannel
            channelUrl={selectedChannel}
            key={key}
            renderMessageInput={
              !shouldAffiliateHaveMessagingPermissions(
                affiliate,
                selectedChannelType || ""
              )
                ? () => <></>
                : undefined
            }
            renderChannelHeader={() => (
              <GroupChannelHeader
                renderRight={() =>
                  displayPatientProfileButton ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigate(
                          `/patients/${
                            (selectedPatientConversation?.patient as Patient)
                              ?.id
                          }`
                        );
                      }}
                      disabled={selectedPatientConversation === null}
                    >
                      {conversationLoading ? (
                        <Spinner className="mr-2" />
                      ) : (
                        <User className="mr-2 h-4 w-4" />
                      )}
                      Patient Profile
                    </Button>
                  ) : null
                }
              />
            )}
            renderMessageContent={({ message }) => (
              <CustomMessage
                patientConversation={selectedPatientConversation || null}
                message={message}
              />
            )}
          />
        </div>
      </div>
    </>
  );
};

export default ChatComponent;
