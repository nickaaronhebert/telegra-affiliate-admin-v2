import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import CustomCardForm from "./PaymentForm";
import { usePaymentProcessorsQuery } from "@/redux/services/paymentMethod";

interface AddStripeCardProps {
  handleClose: (arg: boolean) => void;
  onPaymentMethodCreated?: (paymentMethod: any) => void;
}
export default function AddStripeCard({ handleClose, onPaymentMethodCreated }: AddStripeCardProps) {
  const [stripePromise, setStripePromise] =
    useState<Promise<Stripe | null> | null>(null);

  const { data } = usePaymentProcessorsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      data: data?.data?.find((item) => item.name === "STRIPE_PUBLISHER_KEY"),
    }),
  });

  useEffect(() => {
    if (data?.value) {
      const stripe = loadStripe(data.value);
      setStripePromise(stripe);
    }
  }, [data]);

  if (!stripePromise) {
    return <div>Loading payment form...</div>;
  }

  return (
    <Elements stripe={stripePromise}>
      <CustomCardForm handleClose={handleClose} onPaymentMethodCreated={onPaymentMethodCreated} />
    </Elements>
  );
}
