import { baseApi } from ".";
import { TAG_GET_PROJECTS } from "@/types/baseApiTags";

export interface Project {
  id: string;
  title: string;
  paymentMechanism: string;
  waitingRoomRequired: boolean;
  productVariationsToTriggerSynchronousVisitType: any[];
  productsToTriggerWaitingRoom: any[];
  affiliate: string;
  default: boolean;
  paymentStrategy: {
    paymentMechanism: string;
    asynchronousBillPriceToUser: number;
    asynchronousBillPriceToAffiliate: number;
    synchronousBillPriceToUser: number;
    synchronousBillPriceToAffiliate: number;
    processOrderPaymentForAffiliate: boolean;
  };
  assignedPractitioners: any[];
  refillManager: string;
  prescriptionDispersementMechanism: string;
  orderAutoSubmissionEnabled: boolean;
  orderAutoSubmissionPvsDisabled: any[];
  orderAutoSubmissionOnRefills: boolean;
  enhancedEntries: any;
  reminderFrequency: {
    value: number;
    unit: string;
  };
  reminderDeliveryMethod: string;
  allowPatientVisitUpgrade: boolean;
  createdAt: string;
  updatedAt: string;
}

const projectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<Project[], void>({
      query: () => ({
        url: "/projects",
        method: "GET",
      }),
      providesTags: [{ type: TAG_GET_PROJECTS, id: "LIST" }],
    }),
  }),
});

export const { useGetProjectsQuery } = projectsApi;

export default projectsApi;