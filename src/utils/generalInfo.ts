import { PaymentProcessors } from "@/constants";


export const generalInfo = {
  supportEmail: "support@telegramd.com",
  paymentProcessor:
    (import.meta.env.VITE_PAYMENT_PROCESSOR ) ||
    PaymentProcessors.AuthNet, // Default to AuthNet
};

export default generalInfo;
