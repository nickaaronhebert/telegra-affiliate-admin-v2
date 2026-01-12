import { Button } from "@/components/ui/button";
import { ORDER_STATUS } from "@/constants";
import { SendInviteModal } from "@/pages/Patient/details/SendInviteModal";
import { useSendOrderInviteMutation } from "@/redux/services/patient";
import { useState } from "react";
import { toast } from "sonner";

interface SendInviteLinkProps {
  id: string;
  status: string;
}
export default function SendInviteLink({ id, status }: SendInviteLinkProps) {
  const [openInviteDialog, setOpenInviteDialog] = useState(false);
  const [sendOrderInvite, { isLoading }] = useSendOrderInviteMutation();
  return (
    <>
      <Button
        variant={"transparent"}
        onClick={() => setOpenInviteDialog(true)}
        className="min-w-35.75 text-sm font-semibold text-[#008CE3] border-[#008CE3]"
        disabled={
          status === ORDER_STATUS.Cancelled || status === ORDER_STATUS.Completed
        }
      >
        Send Online Visit Link
      </Button>

      <SendInviteModal
        isLoading={isLoading}
        isOpen={openInviteDialog}
        onClose={() => setOpenInviteDialog(false)}
        onSend={async (inviteType: "email" | "sms") => {
          await sendOrderInvite({
            orderId: id,
            data: { inviteType },
          })
            .unwrap()
            .then((data) => {
              toast.success(data?.message || "Link Sent Successfully", {
                duration: 1500,
              });
              setOpenInviteDialog(false);
            })
            .catch((err) => {
              console.log("error", err);
              toast.error("Something went wrong", {
                duration: 1500,
              });
            });
        }}
      />
    </>
  );
}
