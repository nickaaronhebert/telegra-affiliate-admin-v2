import type { IViewPaymentProcessorResponse } from "@/types/responses/IPaymentProcessor";
import { baseApi } from ".";
import {
  TAG_GET_PATIENT_CARDS,
  TAG_GET_PAYMENT_METHODS,
} from "@/types/baseApiTags";

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

    viewPatientPaymentCards: builder.query<
      {
        data: {
          patientId: string;
          paymentMethods: {
            id: string;
            cardBrand: string;
            last4: string;
            expYear: number;
            expMonth: number;
            isDefault: boolean;
          }[];
        };
      },
      {
        patient: string;
        // affiliate: string;
      }
    >({
      query: ({ patient }) => {
        return {
          url: `/paymentMethods?patientId=${patient}`,
          method: "GET",
        };
      },
      providesTags: [TAG_GET_PATIENT_CARDS],
    }),

    addPaymentMethod: builder.mutation<
      any,
      { patientId: string; paymentMethodId: string }
    >({
      query: ({ patientId, paymentMethodId }) => {
        return {
          url: `/paymentMethods`,
          method: "POST",
          body: {
            patientId,
            paymentMethodId,
          },
        };
      },
      invalidatesTags: [TAG_GET_PATIENT_CARDS],
    }),
  }),
});

export const {
  useViewPatientPaymentMethodQuery,
  usePaymentProcessorsQuery,
  useAddPaymentMethodMutation,
  useViewPatientPaymentCardsQuery,
} = paymentMethodApi;

export default paymentMethodApi;
