import PaymentSvg from "@/assets/icons/Payment";
import AddStripeCard from "@/components/AddPaymentCard";
import { ConfirmDialog } from "@/components/common/Dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useAttachPaymentMethodMutation } from "@/redux/services/billingDetails";
import { getLocalStorage } from "@/lib/utils";
import { LOCAL_STORAGE_KEYS } from "@/constants";
import { toast } from "sonner";

const PaymentMethods = () => {
  const [addCardModal, setAddCardModal] = useState(false);
  const [attachPaymentMethod, { isLoading: isAttaching }] =
    useAttachPaymentMethodMutation();

  const handlePaymentMethodCreated = async (paymentMethod: any) => {
    try {
      // Get user data from localStorage
      const userData = getLocalStorage(LOCAL_STORAGE_KEYS.USER);

      if (!userData?.id) {
        toast.error("User information not found. Please log in again.");
        return;
      }

      // Extract payment method ID from Stripe response
      const paymentMethodId = paymentMethod.id;

      if (!paymentMethodId) {
        toast.error("Payment method ID not found.");
        return;
      }

      // Call attachPaymentMethod API
       await attachPaymentMethod({
        paymentMethodData: { paymentMethodId },
        userId: userData.id,
      }).unwrap();

      toast.success("Payment method attached successfully!");
    } catch (error: any) {
      console.error("Failed to attach payment method:", error);
      toast.error(error?.data?.message || "Failed to attach payment method");
    }
  };

  return (
    <div
      id="paymentMethodsInformation"
      className="bg-white rounded-[10px] shadow-sm p-6 mb-2.5"
    >
      <div className="flex gap-2 items-center border-b border-card-border justify-between align-middle pb-4">
        <div className="flex gap-2 items-center">
          <PaymentSvg color="#000000" width={18} height={18} />
          <h1 className="text-base font-bold">Payment Methods</h1>
        </div>
        <Button
          onClick={() => setAddCardModal(true)}
          disabled={isAttaching}
          className="bg-black text-white hover:bg-gray-800 rounded-lg px-4 py-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4 mx-1" />
          {isAttaching ? "PROCESSING..." : "ADD"}
        </Button>
      </div>
      <div className="mt-3">
        <ConfirmDialog
          open={addCardModal}
          onOpenChange={setAddCardModal}
          title="Add Credit Card"
          onConfirm={() => {}}
          showFooter={false}
        >
          <AddStripeCard
            handleClose={setAddCardModal}
            onPaymentMethodCreated={handlePaymentMethodCreated}
          />
        </ConfirmDialog>
      </div>
    </div>
  );
};
export default PaymentMethods;
