import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { PatientOrder } from "@/types/responses/patient";

interface PatientOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: PatientOrder | null;
}

export function PatientOrderModal({
  isOpen,
  onClose,
  order,
}: PatientOrderModalProps) {
  const isEditing = !!order;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="flex-col border-b border-[#D9D9D9] p-4">
          <DialogTitle className="text-lg font-semibold">
            {isEditing ? "Edit Order" : "Add Order"}
          </DialogTitle>
        </DialogHeader>

        <div className="p-5">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Order Details</h3>

              <div className="text-center py-8 text-gray-500">
                <p>Order form fields will be implemented here</p>
                <p className="text-sm mt-2">
                  {isEditing ? "Editing order: " + order?.id : "Creating new order"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="px-[20px] py-[5px] min-h-[40px] cursor-pointer rounded-[50px] border-primary text-primary font-semibold leading-[16px]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleClose}
              className="px-[20px] py-[5px] min-h-[40px] cursor-pointer rounded-[50px] bg-primary text-white font-semibold leading-[16px]"
            >
              {isEditing ? "Update Order" : "Create Order"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}