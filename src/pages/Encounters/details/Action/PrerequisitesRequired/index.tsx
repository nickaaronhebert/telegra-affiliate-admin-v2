import { ConfirmDialog } from "@/components/common/Dialog";
import { Button } from "@/components/ui/button";
import { ORDER_STATUS } from "@/constants";
import { useUpdateEncounterStatusMutation } from "@/redux/services/encounter";
import { useState } from "react";
import { toast } from "sonner";

interface PrerequisitesRequiredProps {
  id: string;
  status: string;
}

export default function PrerequisitesRequired({
  id,
  status,
}: PrerequisitesRequiredProps) {
  let token = localStorage
    .getItem("accessToken")
    ?.replace(/^"|"$/g, "") as string;
  const [openPrerequisitesDialog, setOpenPrerequisitesDialog] = useState(false);
  const [updateStatus, { isLoading }] = useUpdateEncounterStatusMutation();

  return (
    <>
      <Button
        variant={"transparent"}
        onClick={() => setOpenPrerequisitesDialog(true)}
        className="min-w-27.5 text-sm font-semibold text-primary border-primary"
        disabled={
          status === ORDER_STATUS.Cancelled || status === ORDER_STATUS.Completed
        }
      >
        Prerequisites Required
      </Button>

      <ConfirmDialog
        isLoading={isLoading}
        open={openPrerequisitesDialog}
        onOpenChange={setOpenPrerequisitesDialog}
        title="Prerequisites Required?"
        description="Are you sure you want to mark this order as requiring prerequisite completion? This will update the order status accordingly."
        onConfirm={async () => {
          await updateStatus({
            id,
            token,
            status: "requires_prerequisite_completion",
          })
            .unwrap()
            .then((data) => {
              toast.success(
                data?.message ||
                  "Order status updated to requires prerequisite completion",
                {
                  duration: 1500,
                }
              );
              setOpenPrerequisitesDialog(false);
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
