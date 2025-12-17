import { baseApi } from "./index";
import { TAG_PAYMENT_PROCESSOR } from "@/types/baseApiTags";

export interface PaymentProcessorData {
  PROCESSOR_TYPE: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_PUBLISHER_KEY: string;
}

export type PaymentProcessorRow = {
  name: keyof UpdatePaymentProcessorRequest;
  value: string;
};

export interface PaymentProcessorResponse {
  success: boolean;
  data: PaymentProcessorRow[];
}

export interface UpdatePaymentProcessorRequest {
  PROCESSOR_TYPE: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_PUBLISHER_KEY: string;
}

const billingDetailsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentProcessor: builder.query<PaymentProcessorResponse, void>({
      query: () => ({
        url: "/billingDetails/actions/paymentProcessor",
        method: "GET",
      }),
      providesTags: [TAG_PAYMENT_PROCESSOR],
    }),
    
    updatePaymentProcessor: builder.mutation<PaymentProcessorResponse, UpdatePaymentProcessorRequest>({
      query: (data) => ({
        url: "/billingDetails/actions/paymentProcessor",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [TAG_PAYMENT_PROCESSOR],
    }),
  }),
});

export const {
  useGetPaymentProcessorQuery,
  useUpdatePaymentProcessorMutation,
} = billingDetailsApi;