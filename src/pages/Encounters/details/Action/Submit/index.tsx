import { ConfirmDialog } from "@/components/common/Dialog";
import { Button } from "@/components/ui/button";
import { useSubmitEncounterMutation } from "@/redux/services/encounter";
import { useState } from "react";
import { toast } from "sonner";

interface SendInviteLinkProps {
  id: string;
}
export default function SubmitOrder({ id }: SendInviteLinkProps) {
  const [openSubmitDialog, setOpenSubmitDialog] = useState(false);
  const [submitOrder, { isLoading }] = useSubmitEncounterMutation();
  return (
    <>
      <Button
        variant={"transparent"}
        onClick={() => setOpenSubmitDialog(true)}
        className="min-w-27.5 text-sm font-semibold text-primary border-primary"
      >
        Submit
      </Button>

      <ConfirmDialog
        isLoading={isLoading}
        open={openSubmitDialog}
        onOpenChange={setOpenSubmitDialog}
        title="Submit Order ?"
        description={`Are you sure you want to submit this order?`}
        onConfirm={async () => {
          await submitOrder(id)
            .unwrap()
            .then((data) => {
              toast.success(
                data?.message || "Order is successfully submitted",
                {
                  duration: 1500,
                }
              );
              setOpenSubmitDialog(false);
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
