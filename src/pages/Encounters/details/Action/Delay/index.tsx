import { ConfirmDialog } from "@/components/common/Dialog";
import { Button } from "@/components/ui/button";
import { ORDER_STATUS } from "@/constants";
import { useUpdateEncounterStatusMutation } from "@/redux/services/encounter";
import { useState } from "react";
import { toast } from "sonner";

interface DelayProps {
  id: string;
  status: string;
}

export default function Delay({ id, status }: DelayProps) {
  let token = localStorage
    .getItem("accessToken")
    ?.replace(/^"|"$/g, "") as string;
  const [openDelayDialog, setOpenDelayDialog] = useState(false);
  const [updateStatus, { isLoading }] = useUpdateEncounterStatusMutation();

  return (
    <>
      <Button
        variant={"transparent"}
        onClick={() => setOpenDelayDialog(true)}
        className="min-w-27.5 text-sm font-semibold text-primary border-primary"
        disabled={
          status === ORDER_STATUS.Cancelled || status === ORDER_STATUS.Completed
        }
      >
        Delay
      </Button>

      <ConfirmDialog
        isLoading={isLoading}
        open={openDelayDialog}
        onOpenChange={setOpenDelayDialog}
        title="Delay Order?"
        description="Are you sure you want to delay this order? This will update the order status to delayed."
        onConfirm={async () => {
          await updateStatus({
            id,
            token,
            status: "delayed",
          })
            .unwrap()
            .then((data) => {
              toast.success(
                data?.message || "Order status updated to delayed",
                {
                  duration: 1500,
                }
              );
              setOpenDelayDialog(false);
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
