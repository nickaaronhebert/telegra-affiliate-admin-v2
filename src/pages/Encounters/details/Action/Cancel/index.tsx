import { ConfirmDialog } from "@/components/common/Dialog";
import { Button } from "@/components/ui/button";
import { useCancelEncounterMutation } from "@/redux/services/encounter";
import { useState } from "react";
import { toast } from "sonner";

interface CancelEncounterProps {
  id: string;
  status: string;
}
export default function CancelEncounter({ id, status }: CancelEncounterProps) {
  const [openCancelEncounterDialog, setOpenCancelEncounterDialog] =
    useState(false);
  const [cancelEncounter, { isLoading }] = useCancelEncounterMutation();
  return (
    <>
      <Button
        variant={"transparent"}
        onClick={() => setOpenCancelEncounterDialog(true)}
        className="min-w-27.5 text-sm font-semibold text-destructive border-destructive"
        disabled={status === "cancelled"}
      >
        Cancel
      </Button>

      <ConfirmDialog
        isLoading={isLoading}
        open={openCancelEncounterDialog}
        onOpenChange={setOpenCancelEncounterDialog}
        title="Delete Encounter"
        description={`Sure you want to delete this encounter?\nRemember you can’t undo this.`}
        onConfirm={async () => {
          await cancelEncounter(id)
            .unwrap()
            .then((data) => {
              toast.success(
                data?.message || "Order is cancelled successfully",
                {
                  duration: 1500,
                }
              );
              setOpenCancelEncounterDialog(false);
            })
            .catch((err) => {
              console.log("error", err);
              toast.error(err?.data?.message || "Something went wrong", {
                duration: 1500,
              });
            });
        }}
        cancelTextVariant={"outline"}
        cancelText="Keep it"
        cancelTextClass="cursor-pointer rounded-[16px]"
        confirmTextVariant={"destructive"}
        confirmTextClass="text-white min-w-[110px] cursor-pointer rounded-full"
      />
    </>
  );
}
