import PaymentSvg from "@/assets/icons/Payment";
import AddCardButtonWithForm from "@/components/AddCardButtonWithForm";
import { ConfirmDialog } from "@/components/common/Dialog";
import { useState } from "react";
import {
  useAttachPaymentMethodMutation,
  useRemovePaymentMethodMutation,
} from "@/redux/services/billingDetails";
import { getLocalStorage } from "@/lib/utils";
import { LOCAL_STORAGE_KEYS } from "@/constants";
import { toast } from "sonner";
import type { PatientDetail } from "@/types/responses/patient";
import PaymentMethodCard from "@/components/common/PaymentMethodCard/PaymentMethodCard";

interface PaymentMethodsProps {
  patient: PatientDetail;
}

const PaymentMethods = ({ patient }: PaymentMethodsProps) => {
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<any>(null);
  const [attachPaymentMethod, { isLoading: _isAttaching }] =
    useAttachPaymentMethodMutation();
  const [removePaymentMethod] = useRemovePaymentMethodMutation();

  const handlePaymentMethodCreated = async (paymentMethod: any) => {
    try {
      // Get user data from localStorage
      const userData = getLocalStorage(LOCAL_STORAGE_KEYS.USER);

      if (!userData?.id) {
        toast.error("User information not found. Please log in again.");
        return;
      }
      // Support both Stripe (paymentMethodId) and AuthNet (opaqueData) formats
      const paymentMethodId =
        paymentMethod?.id || paymentMethod?.opaqueData?.dataValue;

      if (!paymentMethodId && !paymentMethod?.opaqueData) {
        toast.error("Payment method data not found.");
        return;
      }

      // Call attachPaymentMethod API with flexible payload
      await attachPaymentMethod({
        paymentMethodData: paymentMethod?.opaqueData
          ? paymentMethod
          : { paymentMethodId },
        userId: patient.user,
        patientId: patient.id,
      }).unwrap();

      toast.success("Payment method attached successfully!");
    } catch (error: any) {
      console.error("Failed to attach payment method:", error);
      toast.error(error?.data?.message || "Failed to attach payment method");
    }
  };

  const handleDeleteClick = (paymentMethod: any) => {
    setSelectedPaymentMethod(paymentMethod);
    setDeleteConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedPaymentMethod) return;

    try {
      await removePaymentMethod({
        paymentMethodId: selectedPaymentMethod.paymentId,
        patientId: patient.id,
      }).unwrap();

      toast.success("Payment method deleted successfully!");
    } catch (error: any) {
      console.error("Failed to delete payment method:", error);
      toast.error(error?.data?.message || "Failed to delete payment method");
    } finally {
      // Close the popup regardless of success or error
      setDeleteConfirmModal(false);
      setSelectedPaymentMethod(null);
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
        <AddCardButtonWithForm
          patient={patient}
          buttonText="+  ADD"
          onPaymentMethodCreated={handlePaymentMethodCreated}
        />
      </div>
      <div className="mt-4 space-y-3 overflow-y-auto rounded-lg h-[350px]">
        {patient?.payment?.map((payment) => (
          <PaymentMethodCard
            key={payment.paymentId}
            paymentInfo={payment}
            onSelect={(data) => {
              console.log("Selected payment method ID:", data);
            }}
            OnDelete={() => handleDeleteClick(payment)}
          />
        ))}

        <ConfirmDialog
          open={deleteConfirmModal}
          onOpenChange={setDeleteConfirmModal}
          title="Delete payment method?"
          description="Are you sure you want to delete this patient's payment method? You cannot undo this action."
          onConfirm={handleConfirmDelete}
          confirmText="Delete payment method"
          cancelText="Cancel"
          confirmTextVariant="destructive"
          cancelTextVariant="outline"
        />
      </div>
    </div>
  );
};
export default PaymentMethods;
