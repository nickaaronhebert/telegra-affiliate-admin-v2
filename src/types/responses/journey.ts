import type { Journey } from "../global/commonTypes";

export interface IGetJourneyById {
  data: Journey;
  message: string;
  code: string;
}

export interface ICreateJourneyResponse {
  data?: {
    id: string;
    name: string;
    affiliate: string;
    createdAt: string;
    updatedAt: string;
  };
  message: string;
  code: string;
}
