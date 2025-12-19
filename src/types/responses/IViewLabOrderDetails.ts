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

  notes: {
    id: string;
    subject: string;
    noteType: string;
    content: {
      standardText: string;
    };
    owner: {
      name: string;
      phone: string;
      email: string;
      role: string;
    };
    relatedEntityModel: string;
    relatedEntity: string;
  }[];
}

export interface IViewLabOrderDetails extends LabOrderDetails {}
