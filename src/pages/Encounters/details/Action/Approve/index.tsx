import { ConfirmDialog } from "@/components/common/Dialog";
import { Button } from "@/components/ui/button";
import { ORDER_STATUS } from "@/constants";
import { useApproveEncounterMutation } from "@/redux/services/encounter";
import { useState } from "react";
import { toast } from "sonner";

interface ApproveOrderProps {
  id: string;
  status: string;
}

export default function ApproveOrder({ id, status }: ApproveOrderProps) {
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [approveOrder, { isLoading }] = useApproveEncounterMutation();

  return (
    <>
      <Button
        variant={"transparent"}
        onClick={() => setOpenApproveDialog(true)}
        className="min-w-27.5 text-sm font-semibold text-primary border-primary"
        disabled={
          status === ORDER_STATUS.Cancelled || status === ORDER_STATUS.Completed
        }
      >
        Approve
      </Button>

      <ConfirmDialog
        isLoading={isLoading}
        open={openApproveDialog}
        onOpenChange={setOpenApproveDialog}
        title="Approve Order?"
        description="Are you sure you want to approve this order? This action will move the order forward in the workflow."
        onConfirm={async () => {
          await approveOrder({
            id,
          })
            .unwrap()
            .then((data) => {
              toast.success(data?.message || "Order is successfully approved", {
                duration: 1500,
              });
              setOpenApproveDialog(false);
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
