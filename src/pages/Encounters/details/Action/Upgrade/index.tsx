import { ConfirmDialog } from "@/components/common/Dialog";
import { Button } from "@/components/ui/button";
import { useUpgradeEncounterMutation } from "@/redux/services/encounter";
import { useState } from "react";
import { toast } from "sonner";

interface UpgradeEncounterProps {
  id: string;
}
export default function UpgradeOrder({ id }: UpgradeEncounterProps) {
  const [openUpgradeDialog, setOpenUpgradeDialog] = useState(false);
  const [upgradeOrder, { isLoading }] = useUpgradeEncounterMutation();
  return (
    <>
      <Button
        variant={"transparent"}
        onClick={() => setOpenUpgradeDialog(true)}
        className="min-w-27.5 text-sm font-semibold text-primary border-primary"
      >
        Upgrade to Synchronous
      </Button>

      <ConfirmDialog
        isLoading={isLoading}
        open={openUpgradeDialog}
        onOpenChange={setOpenUpgradeDialog}
        title="Upgrade to Synchronous ?"
        description={`Are you sure you want to upgrade this order to synchronous?`}
        onConfirm={async () => {
          await upgradeOrder(id)
            .unwrap()
            .then((data) => {
              toast.success(data?.message || "Order is successfully upgraded", {
                duration: 1500,
              });
              setOpenUpgradeDialog(false);
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
