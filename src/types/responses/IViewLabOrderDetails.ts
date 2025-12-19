import type { Note } from "@/redux/services/notes";
import type { Patient } from "../global/commonTypes";

export interface LabOrderDetails {
  id: string;
  status: string;
  createdAt: string;
  labOrderNumber: string;
  patient: Pick<
    Patient,
    | "firstName"
    | "lastName"
    | "email"
    | "phone"
    | "genderBiological"
    | "dateOfBirth"
    | "id"
  > & {
    gender: string;
  };
  address: {
    shipping: {
      address1: string;
      address2: string;
      city: string;
      zipcode: string;
      state: { name: string; id: string };
    };
  };

  lab: {
    id: string;
    name: string;
  };
  labPanels: {
    id: string;
    title: string;
    lab: string;
    description: string;
  }[];

  afterResultsOrderProductVariations: {
    productVariation: {
      id: string;
      description: string;
      strength: string;
    };
    quantity: number;
  }[];

  notes: Note[];
}

export interface IViewLabOrderDetails extends LabOrderDetails {}
