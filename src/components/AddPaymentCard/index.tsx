import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import CustomCardForm from "./PaymentForm";
import { usePaymentProcessorsQuery } from "@/redux/services/paymentMethod";
import { LoadingSpinner } from "../ui/loading-spinner";
import { PAYMENT_PROCESSOR_KEYS } from "@/constants";

interface AddStripeCardProps {
  handleClose: (arg: boolean) => void;
  onPaymentMethodCreated?: (paymentMethod: any) => void;
  patientId?: string;
}
export default function AddStripeCard({
  handleClose,
  onPaymentMethodCreated,
  patientId,
}: AddStripeCardProps) {
  const [stripePromise, setStripePromise] =
    useState<Promise<Stripe | null> | null>(null);

  const { data } = usePaymentProcessorsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      data: data?.data?.find((item) => item.name === PAYMENT_PROCESSOR_KEYS.STRIPE_PUBLISHER_KEY),
    }),
  });

  useEffect(() => {
    if (data?.value) {
      const stripe = loadStripe(data.value);
      setStripePromise(stripe);
    }
  }, [data]);

  if (!stripePromise) {
    return (
      <div className="flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CustomCardForm
        handleClose={handleClose}
        onPaymentMethodCreated={onPaymentMethodCreated}
        patientId={patientId}
      />
    </Elements>
  );
}
