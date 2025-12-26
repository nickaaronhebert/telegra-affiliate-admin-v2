import { useState, useMemo, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { generalInfo } from "@/utils/generalInfo";
import { PaymentProcessors } from "@/constants";
import { AuthNetButtonWithForm } from "@/components/AuthNetButtonWithForm";
import AddStripeCard from "@/components/AddPaymentCard";
import { usePaymentProcessorsQuery } from "@/redux/services/paymentMethod";

interface AddCardButtonWithFormProps {
  patient?: { id: string };
  setupIntent?: string;
  buttonText?: string;
  isReplace?: boolean;
  onPaymentMethodCreated?: (paymentMethod: any) => void;
  onClose?: (open: boolean) => void;
}

/**
 * AddCardButtonWithForm Component
 * Reusable component supporting both Stripe and Authorize.Net payment processors
 * Automatically selects processor based on configuration
 */
export const AddCardButtonWithForm = ({
  buttonText,
  isReplace = false,
  onPaymentMethodCreated,
  onClose,
}: AddCardButtonWithFormProps) => {
  const [showModal, setShowModal] = useState(false);
  const [stripePromise, setStripePromise] =
    useState<Promise<Stripe | null> | null>(null);
  // Note: isLoading is false here since react-acceptjs handles its own loading state
  const isLoading = false;

  // Fetch payment processor config
  const { data: processorData } = usePaymentProcessorsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      data: data?.data?.find((item) => item.name === "STRIPE_PUBLISHER_KEY"),
    }),
  });

  // Determine which payment processor to use
  const isAuthNet = useMemo(
    () => generalInfo.paymentProcessor === PaymentProcessors.AuthNet,
    []
  );

  const isStripe = useMemo(
    () => generalInfo.paymentProcessor === PaymentProcessors.Stripe,
    []
  );
  // Load Stripe key if using Stripe
  useEffect(() => {
    if (!isStripe || !processorData?.value) return;

    const stripe = loadStripe(processorData.value);
    setStripePromise(stripe);
  }, [processorData, isStripe]);

  const modalTitle = useMemo(() => {
    return isReplace ? "Replace Credit Card" : "Add Credit Card";
  }, [isReplace]);

  const displayButtonText = useMemo(() => {
    if (buttonText) return buttonText;
    return isReplace ? "REPLACE" : "ADD";
  }, [buttonText, isReplace]);

  const handleOpenModal = () => {
    setShowModal(true);
    if (onClose) {
      onClose(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (onClose) {
      onClose(false);
    }
  };

  const handleStripePaymentCreated = (paymentMethod: any) => {
    if (onPaymentMethodCreated) {
      onPaymentMethodCreated(paymentMethod);
    }
    handleCloseModal();
  };

  const handleAuthNetSubmit = (paymentMethod: any) => {
    if (onPaymentMethodCreated) {
      onPaymentMethodCreated(paymentMethod);
    }
  };

  // AuthNet Implementation
  if (isAuthNet) {
    return (
      <div className="authnet-add-card-button">
        <AuthNetButtonWithForm
          handleSubmit={handleAuthNetSubmit}
          buttonText={displayButtonText}
          formHeaderText={modalTitle}
          formButtonText="SAVE CARD"
          isLoading={isLoading}
          onClose={handleCloseModal}
        />
      </div>
    );
  }

  // Stripe Implementation
  if (isStripe && stripePromise) {
    return (
      <div className="stripe-add-card-button">
        {!showModal ? (
          <Button
            onClick={handleOpenModal}
            className="bg-black text-white hover:bg-gray-800 rounded-lg px-4 py-2"
          >
            <Plus className="w-4 h-4 mr-1" />
            {displayButtonText}
          </Button>
        ) : (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">{modalTitle}</h2>

              <Elements stripe={stripePromise}>
                <AddStripeCard
                  handleClose={handleCloseModal}
                  onPaymentMethodCreated={handleStripePaymentCreated}
                />
              </Elements>

              <Button
                variant="outline"
                onClick={handleCloseModal}
                className="w-full mt-4"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Loading state
  return (
    <Button disabled className="bg-gray-300 text-gray-500">
      Loading payment options...
    </Button>
  );
};

export default AddCardButtonWithForm;
