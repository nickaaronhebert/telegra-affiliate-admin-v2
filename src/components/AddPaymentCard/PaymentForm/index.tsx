import React, { useState } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import type { StripeCardElementOptions } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";

// import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/store";
import { baseApi } from "@/redux/services";
import { TAG_GET_PAYMENT_METHODS } from "@/types/baseApiTags";

interface StripeWrapperProps {
  elementType: "number" | "expiry" | "cvc";
  placeholder?: string;
  className?: string; // optional extra classes for wrapper
  options?: StripeCardElementOptions; // custom style options
  onChange?: (event: any) => void; // handle Stripe change events
}

interface CustomCardFormProps {
  handleClose: (arg1: boolean) => void;
}

const StripeCardField: React.FC<StripeWrapperProps> = ({
  elementType,
  className = "",
  onChange,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Map elementType to the actual Stripe element component
  const ElementComponent =
    elementType === "number"
      ? CardNumberElement
      : elementType === "expiry"
      ? CardExpiryElement
      : CardCvcElement;

  // Default style if not provided
  const defaultOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#1a1a1a",
        "::placeholder": { color: "#a0aec0" },
      },
      focus: {
        // Define your focus styles here
        color: "#32325d",
        boxShadow: "0 0 0 2px #5469d4",
        outline: "none",
      },
      invalid: { color: "#e53e3e" },
    },
  };
  // focus:ring-2 focus:ring-blue-500 focus:outline-none
  return (
    <div
      className={`w-full rounded-md p-4 border transition ${className} ${
        isFocused ? "ring-2 ring-blue-500 outline-none" : "border-card-border"
      }`}
    >
      <ElementComponent
        options={defaultOptions}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={onChange}
      />
    </div>
  );
};

const CustomCardForm = ({ handleClose }: CustomCardFormProps) => {
  //   const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const stripe = useStripe();
  const elements = useElements();

  const [cardholderName, setCardholderName] = useState("");
  const [zip, setZip] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>("");
  //   const handleCancelOrBack = () => {
  //     if (entityType === "subOrg") {
  //       dispatch(prevStep());
  //     }
  //     hideCard?.(false);
  //   };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || isProcessing) return;

    if (!cardholderName.trim()) {
      setError("Cardholder name is required");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const cardNumberElement = elements.getElement(CardNumberElement);

      if (!cardNumberElement) {
        throw new Error("Card element not found");
      }

      const { error: stripeError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardNumberElement,
          billing_details: {
            name: cardholderName,
          },
        });

      if (stripeError) {
        setError(stripeError.message || "Failed to create payment method");
        return;
      }

      if (paymentMethod?.id) {
        dispatch(baseApi.util.invalidateTags([TAG_GET_PAYMENT_METHODS]));
        setCardholderName("");
        setZip("");
        elements.getElement(CardNumberElement)?.clear();
        elements.getElement(CardExpiryElement)?.clear();
        elements.getElement(CardCvcElement)?.clear();
        toast.success("Card Added Successfully", {
          duration: 1500,
        });
        handleClose(false);
        // onSubmit(paymentMethod.id);
        // handleClose();
      }
    } catch (err: any) {
      console.error("Payment method creation error:", err);
      setError(err.message || "An error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-6">
      {/* <h2 className="text-xl font-semibold">Credit Card Information</h2> */}

      {/* Cardholder Name */}
      <div>
        <label
          className="block text-sm font-semibold mb-1"
          htmlFor="card-holder-name"
        >
          Cardholder Name <span className="text-red-500">*</span>
        </label>
        <input
          id="card-holder-name"
          type="text"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          placeholder="John Smith"
          required
          className="w-full border border-card-border rounded-md p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Card Number */}

      <div className="">
        <label className="block text-sm font-semibold mb-1 border-none">
          <span className="mb-1">
            Credit Card Number <span className="text-red-500">*</span>
          </span>
          <StripeCardField elementType="number" placeholder="Card Number" />
        </label>
      </div>

      {/* Expiration Date + CVC */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm  font-semibold mb-1">
            <span className="mb-1">
              Expiration Date (MM/YY) <span className="text-red-500">*</span>
            </span>

            <StripeCardField elementType="expiry" placeholder="MM/YY" />
          </label>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">
            <span className="mb-1">
              CVC / CVV <span className="text-red-500">*</span>
            </span>

            <StripeCardField elementType="cvc" placeholder="CVC" />
          </label>
        </div>
      </div>

      {/* Billing Zip Code */}
      <div>
        <label className="block text-sm font-semibold mb-1" htmlFor="zip-code">
          Billing Zip Code <span className="text-red-500">*</span>
        </label>
        <input
          id="zip-code"
          type="text"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          placeholder="60601"
          required
          className="w-full border border-card-border rounded-md p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {error && (
        <div className="border p-4 rounded-lg border-destructive">
          <p className="text-destructive">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end items-center gap-4">
        <Button
          type="button"
          onClick={() => handleClose(false)}
          variant={"transparent"}
          //   size={"xl"}
          //   onClick={handleCancelOrBack}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          variant={"ctrl"}
          //   size={"xl"}
        >
          Add Card
          {/* {loading
            ? "Processing..."
            : entityType === "subOrg"
            ? "Create SubOrganization"
            : "Add Payment Method"} */}
        </Button>
      </div>
    </form>
  );
};

export default CustomCardForm;
