import { baseApi } from "./index";
import { TAG_PAYMENT_PROCESSOR, TAG_GET_PAYMENT_METHODS, TAG_GET_PATIENTS } from "@/types/baseApiTags";

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

export interface AttachPaymentMethodRequest {
  paymentMethodData: any;
  userId: string;
}

export interface AttachPaymentMethodResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface RemovePaymentMethodRequest {
  paymentMethodId: string;
  patientId: string;
}

export interface RemovePaymentMethodResponse {
  success: boolean;
  message?: string;
  data?: any;
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

    attachPaymentMethod: builder.mutation<AttachPaymentMethodResponse, AttachPaymentMethodRequest>({
      query: (data) => ({
        url: "/billingDetails/actions/attachPaymentMethod",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [TAG_GET_PAYMENT_METHODS],
    }),

    removePaymentMethod: builder.mutation<RemovePaymentMethodResponse, RemovePaymentMethodRequest>({
      query: (data) => ({
        url: "/billingDetails/actions/removeCard",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: (_result, _error, { patientId }) => [
        { type: TAG_GET_PATIENTS, id: patientId },
        { type: TAG_GET_PATIENTS, id: `${patientId}-payment` },
        TAG_GET_PAYMENT_METHODS,
      ],
    }),
  }),
});

export const {
  useGetPaymentProcessorQuery,
  useUpdatePaymentProcessorMutation,
  useAttachPaymentMethodMutation,
  useRemovePaymentMethodMutation,
} = billingDetailsApi;