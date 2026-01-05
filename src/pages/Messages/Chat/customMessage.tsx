import { type FC } from "react";
import Message from "@sendbird/uikit-react/GroupChannel/components/Message";
import MessageContent, {
  type MessageContentProps,
} from "@sendbird/uikit-react/ui/MessageContent";
import Label, {
  LabelColors,
  LabelTypography,
} from "@sendbird/uikit-react/ui/Label";
import { cn } from "@/lib/utils";
import type { IPatientConversation } from "@/types/chat";

// Type for message with data property
interface CoreMessageType {
  data: string;
  customType?: string;
  sender?: {
    userId: string;
    nickname?: string;
  };
}

// Type for EveryMessage (generic message type from SendBird)
type EveryMessage = CoreMessageType & Record<string, any>;

interface CustomMessageContentProps {
  message: CoreMessageType;
}

interface CustomMessageProps {
  message: EveryMessage;
  patientConversation: IPatientConversation | null;
}

/**
 * Custom message content component for rendering HTML messages
 */
export const CustomMessageContent: FC<CustomMessageContentProps> = ({
  message,
}) => {
  const fixedJsonString = message.data
    .replace(/'/g, '"') // Replace single quotes with double quotes
    .replace(/\\"/g, '"');

  // Extract content after "htmlContent":
  const extractedContent = fixedJsonString.split('{"htmlContent": "')[1]?.trim() || "";

  // Remove trailing comma or closing brace if needed
  const cleanedContent = extractedContent.replace(/,$/, "").replace(/}$/, "");
  const cleanedHtml = cleanedContent.replace(/\\n"/g, "\n\n");

  return (
    <div className={cn("w-full")}>
      <div
        className="prose prose-sm max-w-none p-3 bg-muted rounded-lg"
        dangerouslySetInnerHTML={{ __html: cleanedHtml }}
      />
    </div>
  );
};

/**
 * Custom message content for historical/migrated bot messages
 */
const CustomMessageHistoricalBotContent: FC<CustomMessageContentProps> = ({
  message,
}) => {
  let cleanedHtml: string | undefined;
  const parsedHtml = message.data.split("'htmlContent': '")[1]?.trim();

  if (parsedHtml) {
    const cleanedContent = parsedHtml.replace(/,$/, "").replace(/}$/, "");
    cleanedHtml = cleanedContent.replace(/\\n/g, "\n\n");
  }

  // Wrap it in single quotes
  const finalString = cleanedHtml
    ? `'${cleanedHtml}'`
    : "Unable to render HTML content";

  return (
    <div className={cn("w-full")}>
      <div
        className="prose prose-sm max-w-none p-3 bg-muted rounded-lg"
        dangerouslySetInnerHTML={{ __html: finalString }}
      />
    </div>
  );
};

/**
 * Main custom message component that wraps SendBird's Message component
 */
export const CustomMessage: FC<CustomMessageProps> = ({ message }) => {
  return (
    <Message
      message={message as any}
      renderMessageContent={(props: MessageContentProps) => {
        const isProvider =
          "sender" in props.message && props.message.sender?.userId
            ? props.message.sender.userId.includes("usr::")
            : false;

        // Derive a display name similar to Sendbird's default header
        const senderId =
          "sender" in props.message && props.message.sender?.userId;
        const memberName = props.channel?.members?.find(
          (m) => m?.userId === senderId
        )?.nickname;
        const baseName =
          memberName ||
          ("sender" in props.message && props.message.sender?.nickname) ||
          "";
        const labeledName = isProvider
          ? `${baseName} - Practitioner`
          : baseName;

        const isHtml = props.message.customType === "html";

        return (
          <MessageContent
            {...props}
            renderMessageHeader={() => (
              <Label
                className="sendbird-message-content__middle__sender-name"
                type={LabelTypography.CAPTION_2}
                color={LabelColors.ONBACKGROUND_2}
              >
                {labeledName}
              </Label>
            )}
            {...(isHtml
              ? {
                  renderMessageBody: () => (
                    <>
                      {(props.message.data?.indexOf?.('migrated_from') ??
                        -1) === -1 ? (
                        <CustomMessageContent message={props.message} />
                      ) : (
                        <CustomMessageHistoricalBotContent
                          message={props.message}
                        />
                      )}
                    </>
                  )
                }
              : {})}
          />
        );
      }}
    />
  );
};
