import { baseApi } from ".";

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
    }),
  }),
});

export const { useViewPatientPaymentMethodQuery } = paymentMethodApi;

export default paymentMethodApi;
