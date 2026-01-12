import { authData } from "@/utils/authNet";
import { HostedForm } from "react-acceptjs";
import { toast } from "sonner";
import { AuthNetEnvironment } from "@/constants";

interface AuthNetButtonWithFormProps {
  handleSubmit: (paymentMethod: any) => void;
  buttonText?: string;
  formHeaderText?: string;
  formButtonText?: string;
  buttonClassName?: string;
  containerClassName?: string;
  errorTextClassName?: string;
  isLoading?: boolean;
  onClose?: () => void;
}

/**
 * AuthNetButtonWithForm Component
 * Handles Authorize.Net payment form integration using react-acceptjs
 * Provides a clean React wrapper around the hosted payment form
 */
export const AuthNetButtonWithForm = ({
  handleSubmit,
  buttonText = "+ Add",
  formHeaderText = "Add Credit Card",
  containerClassName = "",
  onClose,
}: AuthNetButtonWithFormProps) => {
  const handleHostedFormSubmit = (response: any) => {
    try {
      // Check if payment was successful
      if (response && response.opaqueData && response.opaqueData.dataValue) {
        handleSubmit(response);

        // toast.success("Payment method added successfully!");

        // Close modal if callback is provided
        if (onClose) {
          onClose();
        }
      } else {
        const errorMsg =
          response?.messages?.[0]?.text || "Failed to process payment method";
        toast.error(errorMsg);
        console.error("Payment failed:", response);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      console.error("Payment submission error:", errorMessage);
      toast.error(errorMessage);
    }
  };

  const environment = authData.sandbox
    ? (AuthNetEnvironment.Sandbox as any)
    : (AuthNetEnvironment.Production as any);
  return (
    <div className={`authnet-button-wrapper ${containerClassName}`}>
      <HostedForm
        authData={authData}
        environment={environment}
        onSubmit={handleHostedFormSubmit}
        buttonText={buttonText || "+  Add"}
        formHeaderText={formHeaderText || "Add Credit Card"}
        formButtonText={"Save"}
        buttonStyle={{
          background: "#000000",
          color: "white",
          padding: "8px 12px",
          cursor: "pointer",
          borderRadius: "10px",
          border: "none",
          fontSize: "14px",
        }}
        // containerClassName={`add_card_container ${containerClassName}`}
        // errorTextClassName={`add_card_error ${errorTextClassName}`}
        // billingAddressOptions={{ show: false, required: false }}
      />
    </div>
  );
};

export default AuthNetButtonWithForm;
