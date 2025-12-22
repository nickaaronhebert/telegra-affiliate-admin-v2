import { baseApi } from ".";
import type { IViewAllPatientsRequest, IUpdatePatientMedicationsRequest, IUpdatePatientAllergiesRequest, ISendOrderInviteRequest, IUpdatePatientRequest, IViewPatientOrdersRequest, IUploadPatientFileRequest } from "@/types/requests/patient";
import type { PatientsResponse, PatientDetail, PatientOrdersResponse, PaymentMethod } from "@/types/responses/patient";
import { TAG_GET_PATIENTS } from "@/types/baseApiTags";

const patientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    viewAllPatients: builder.query<
      PatientsResponse,
      IViewAllPatientsRequest
    >({
      query: ({ page = 1, limit = 20, firstName }) => {
        const params = new URLSearchParams({
          limit: limit.toString(),
          page: page.toString(),
        });
        if (firstName) {
          params.append('patient', firstName);
        }
        return {
          url: `/patients?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) => {
        return result
          ? [
            ...result?.result?.map(({ id }) => ({
              type: TAG_GET_PATIENTS,
              id,
            })),
            { type: TAG_GET_PATIENTS, id: "LIST" },
          ]
          : [{ type: TAG_GET_PATIENTS, id: "LIST" }];
      },
    }),

    viewPatientById: builder.query<PatientDetail, string>({
      query: (id) => {
        return {
          url: `/patients/${id}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, id) => [{ type: TAG_GET_PATIENTS, id }],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Fetch patient orders after patient data is successfully loaded
          const ordersResult = await dispatch(
            patientApi.endpoints.viewPatientOrders.initiate({ patientId: id })
          );

          if (ordersResult.data) {
            // Update the patient cache with orders data
            dispatch(
              patientApi.util.updateQueryData('viewPatientById', id, (draft) => {
                draft.orders = ordersResult.data!.result;
                console.log("Updated patient datasss:", draft.orders);

              })
            );
          }

          // Fetch available payment methods after orders
          const paymentResult = await dispatch(
            patientApi.endpoints.getAvailablePaymentMethods.initiate({ patientId: id })
          );

          if (paymentResult.data) {
            // Update the patient cache with payment methods data
            dispatch(
              patientApi.util.updateQueryData('viewPatientById', id, (draft) => {
                console.log("Updating patient payment data in cache:", paymentResult.data);
                draft.payment = paymentResult.data;
                console.log("Updated patient data:",  draft.payment);
              })
            );
          }
        } catch {
          // If orders or payment fetch fails, patient data will still be available
        }
      },
    }),

    viewPatientOrders: builder.query<PatientOrdersResponse, IViewPatientOrdersRequest>({
      query: ({ patientId }) => {
        const params = new URLSearchParams({
          id: patientId,
          patient: patientId,
        });
        return {
          url: `/orders/affiliate?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, { patientId }) => [
        { type: TAG_GET_PATIENTS, id: `${patientId}-orders` },
      ],
    }),

    getAvailablePaymentMethods: builder.query<PaymentMethod[], { patientId: string }>({
      query: ({ patientId }) => {
        const params = new URLSearchParams({
          patient: patientId,
        });
        return {
          url: `/billingDetails/actions/getAvailablePaymentMethods?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, { patientId }) => [
        { type: TAG_GET_PATIENTS, id: `${patientId}-payment` },
      ],
    }),

    createPatient: builder.mutation<any, any>({
      query: (patientData) => ({
        url: "/patients",
        method: "POST",
        body: patientData,
      }),
      invalidatesTags: [{ type: TAG_GET_PATIENTS, id: "LIST" }],
    }),

    updatePatient: builder.mutation<PatientDetail, { id: string; data: IUpdatePatientRequest }>({
      query: ({ id, data }) => ({
        url: `/patients/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: TAG_GET_PATIENTS, id },
        { type: TAG_GET_PATIENTS, id: "LIST" },
      ],
    }),

    updatePatientMedications: builder.mutation<PatientDetail, { id: string; data: IUpdatePatientMedicationsRequest }>({
      query: ({ id, data }) => ({
        url: `/patients/${id}`,
        method: "PUT",
        body: data,
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedPatient } = await queryFulfilled;
          // Update the individual patient cache
          dispatch(
            patientApi.util.updateQueryData('viewPatientById', id, (draft) => {
              Object.assign(draft, updatedPatient);
            })
          );
          // Update the patient in the patients list cache
          dispatch(
            patientApi.util.updateQueryData('viewAllPatients', {} as IViewAllPatientsRequest, (draft) => {
              if (draft?.result) {
                const patientIndex = draft.result.findIndex(p => p.id === id);
                if (patientIndex !== -1) {
                  Object.assign(draft.result[patientIndex], updatedPatient);
                }
              }
            })
          );
        } catch {
          // If the mutation fails, we don't need to update the cache
        }
      },
    }),

    updatePatientAllergies: builder.mutation<PatientDetail, { id: string; data: IUpdatePatientAllergiesRequest }>({
      query: ({ id, data }) => ({
        url: `/patients/${id}`,
        method: "PUT",
        body: data,
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedPatient } = await queryFulfilled;
          // Update the individual patient cache
          dispatch(
            patientApi.util.updateQueryData('viewPatientById', id, (draft) => {
              Object.assign(draft, updatedPatient);
            })
          );
          // Update the patient in the patients list cache
          dispatch(
            patientApi.util.updateQueryData('viewAllPatients', {} as IViewAllPatientsRequest, (draft) => {
              if (draft?.result) {
                const patientIndex = draft.result.findIndex(p => p.id === id);
                if (patientIndex !== -1) {
                  Object.assign(draft.result[patientIndex], updatedPatient);
                }
              }
            })
          );
        } catch {
          // If the mutation fails, we don't need to update the cache
        }
      },
    }),

    sendOrderInvite: builder.mutation<any, { orderId: string; data: ISendOrderInviteRequest }>({
      query: ({ orderId, data }) => ({
        url: `/orders/${orderId}/actions/sendOrderLink`,
        method: "POST",
        body: data,
      }),
    }),

    uploadPatientFile: builder.mutation<any, { patientId: string; data: { fileData: string; fileName: string } }>({
      query: ({ patientId, data }) => {
        return {
          url: `/patients/${patientId}/uploadFile`,
          method: "POST",
          body: {
            patientId,
            data: {
              fileData: data.fileData,
              fileName: data.fileName,
            },
          },
        };
      },
      async onQueryStarted({ patientId }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Refetch patient data to get updated files list
          dispatch(
            patientApi.util.invalidateTags([{ type: TAG_GET_PATIENTS, id: patientId }])
          );
        } catch {
          // If the mutation fails, we don't need to update the cache
        }
      },
    }),
  }),
});

export const {
  useViewAllPatientsQuery,
  useViewPatientByIdQuery,
  useViewPatientOrdersQuery,
  useGetAvailablePaymentMethodsQuery,
  useCreatePatientMutation,
  useUpdatePatientMutation,
  useUpdatePatientMedicationsMutation,
  useUpdatePatientAllergiesMutation,
  useSendOrderInviteMutation,
  useUploadPatientFileMutation,
} = patientApi;

export default patientApi;
