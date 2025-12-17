import type { IViewPaymentProcessorResponse } from "@/types/responses/IPaymentProcessor";
import { baseApi } from ".";
import { TAG_GET_PAYMENT_METHODS } from "@/types/baseApiTags";

const paymentMethodApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    viewPatientPaymentMethod: builder.query<
      {
        paymentId: string;
        cardBrand: string;
        last4: string;
        expYear: number;
        expMonth: number;
        isDefault: boolean;
      }[],
      {
        patient: string;
        affiliate: string;
      }
    >({
      query: ({ patient, affiliate }) => {
        return {
          url: `/billingDetails/actions/getAvailablePaymentMethods?patient=${patient}&affiliate=${affiliate}`,
          method: "GET",
        };
      },
      providesTags: [TAG_GET_PAYMENT_METHODS],
    }),

    paymentProcessors: builder.query<IViewPaymentProcessorResponse, void>({
      query: () => {
        return {
          url: `/billingDetails/actions/paymentProcessor`,
          method: "GET",
        };
      },
      // providesTags: (_result, _error, id) => [{ type: TAG_GET_LAB_ORDER, id }],
    }),
  }),
});

export const { useViewPatientPaymentMethodQuery, usePaymentProcessorsQuery } =
  paymentMethodApi;

export default paymentMethodApi;
