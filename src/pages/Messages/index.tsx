import { useGetAffiliateDetailsQuery } from "@/redux/services/organizationIdentity";
import SendbirdProvider from "@sendbird/uikit-react/SendbirdProvider";
import { Spinner } from "@/components/ui/spinner";
import ChatComponent from "./Chat";

const MessagesPage = () => {
  const { data: affiliateDetails, isLoading } = useGetAffiliateDetailsQuery();

  if (isLoading || !affiliateDetails?.settings?.participantIdentifier) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <>
      {affiliateDetails?.affiliateChatSystem ? (
        <SendbirdProvider
          appId={import.meta.env.VITE_SENDBIRD_APP_ID}
          userId={affiliateDetails.settings.participantIdentifier}
          accessToken={affiliateDetails.settings.participantSecondaryIdentifier}
        >
          <ChatComponent />
        </SendbirdProvider>
      ) : (
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <p className="text-sm text-muted-foreground">
            Chat system is not enabled for this affiliate.
          </p>
        </div>
      )}
    </>
  );
};
export default MessagesPage;
