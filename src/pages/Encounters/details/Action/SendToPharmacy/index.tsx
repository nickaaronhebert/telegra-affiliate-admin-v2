import { ConfirmDialog } from "@/components/common/Dialog";
import { Button } from "@/components/ui/button";
import { ORDER_STATUS } from "@/constants";
import { useSendToPharmacyMutation } from "@/redux/services/encounter";
import { useState } from "react";
import { toast } from "sonner";

interface SendToPharmacyProps {
  id: string;
  status: string;
}

export default function SendToPharmacy({ id, status }: SendToPharmacyProps) {
  const [openSendToPharmacyDialog, setOpenSendToPharmacyDialog] =
    useState(false);
  const [sendToPharmacy, { isLoading }] = useSendToPharmacyMutation();

  return (
    <>
      <Button
        variant={"transparent"}
        onClick={() => setOpenSendToPharmacyDialog(true)}
        className="min-w-27.5 text-sm font-semibold text-primary border-primary"
        disabled={
          status === ORDER_STATUS.Cancelled || status === ORDER_STATUS.Completed
        }
      >
        Send to Pharmacy
      </Button>

      <ConfirmDialog
        isLoading={isLoading}
        open={openSendToPharmacyDialog}
        onOpenChange={setOpenSendToPharmacyDialog}
        title="Send to Pharmacy?"
        description="Are you sure you want to send this order to pharmacy recipients? This action will notify the pharmacy about the order."
        onConfirm={async () => {
          await sendToPharmacy({
            orderIdentifier: id,
          })
            .unwrap()
            .then((data) => {
              toast.success(
                data?.message || "Order sent to pharmacy successfully",
                {
                  duration: 1500,
                }
              );
              setOpenSendToPharmacyDialog(false);
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
