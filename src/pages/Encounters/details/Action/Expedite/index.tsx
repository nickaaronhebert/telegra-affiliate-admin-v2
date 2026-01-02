import { ConfirmDialog } from "@/components/common/Dialog";
import { Button } from "@/components/ui/button";
import { ORDER_STATUS } from "@/constants";
import { useExpediteEncounterMutation } from "@/redux/services/encounter";
import { useState } from "react";
import { toast } from "sonner";

interface SendInviteLinkProps {
  id: string;
  status: string;
}
export default function Expedite({ id, status }: SendInviteLinkProps) {
  let token = localStorage
    .getItem("accessToken")
    ?.replace(/^"|"$/g, "") as string;
  const [openExpediateDialog, setOpenExpediateDialog] = useState(false);
  const [expediteOrder, { isLoading }] = useExpediteEncounterMutation();
  return (
    <>
      <Button
        variant={"transparent"}
        onClick={() => setOpenExpediateDialog(true)}
        className="min-w-27.5 text-sm font-semibold text-primary border-primary"
        disabled={
          status === ORDER_STATUS.Cancelled || status === ORDER_STATUS.Completed
        }
      >
        Expedite
      </Button>

      <ConfirmDialog
        isLoading={isLoading}
        open={openExpediateDialog}
        onOpenChange={setOpenExpediateDialog}
        title="Expedite Order ?"
        description={`Expedited orders will be performed within 1 business hour. There is a $5 fee to expedite an order. To expedite the consultation, please confirm. Expediting an order will only occur for orders in the "Waiting Room" or "Provider Review" status in Telegra`}
        onConfirm={async () => {
          await expediteOrder({
            id,
            token,
            expedited: true,
          })
            .unwrap()
            .then((data) => {
              toast.success(
                data?.message || "Order is successfully expedited",
                {
                  duration: 1500,
                }
              );
              setOpenExpediateDialog(false);
            })
            .catch((err) => {
              console.log("error", err);
              toast.error(err?.data?.message || "Something went wrong", {
                duration: 1500,
              });
            });
        }}
        cancelTextVariant={"outline"}
        cancelTextClass="cursor-pointer rounded-[16px]"
        confirmTextClass="text-white min-w-[110px] cursor-pointer rounded-full"
      />
    </>
  );
}
