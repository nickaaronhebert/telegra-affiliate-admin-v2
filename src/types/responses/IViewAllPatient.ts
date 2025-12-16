import type { Patient } from "../global/commonTypes";

export interface IViewAllPatientResponse {
  result: Patient[];
  count: number;
}
