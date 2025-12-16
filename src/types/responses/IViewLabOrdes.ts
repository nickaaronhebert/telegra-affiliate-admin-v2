import type { Patient } from "../global/commonTypes";

export interface LabOrderInterface {
  id: string;
  patient: Pick<Patient, "firstName" | "lastName" | "email">;
  status: string;
  labOrderNumber: string;
  createdAt: string;
  labPanels: {
    id: string;
    title: string;
  }[];
}

export interface IViewLabOrdersResponse {
  count: number;
  result: LabOrderInterface[];
}
