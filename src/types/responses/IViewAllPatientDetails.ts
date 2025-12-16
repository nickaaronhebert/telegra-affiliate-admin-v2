import type { Patient } from "../global/commonTypes";

type Address = {
  _id: string;
  id: string;
  owner: string;
  defaultAddress: boolean;
  billing: {
    address1: string;
    address2?: string;
    city: string;
    state: {
      id: string;
      name: string;
      abbbreviation: string;
    };
    zipcode: string;
  };
  shipping: {
    address1: string;
    address2?: string;
    city: string;
    state: {
      id: string;
      name: string;
      abbbreviation: string;
    };
    zipcode: string;
  };
};
export interface IViewAllPatientDetailsResponse extends Patient {
  addresses: Address[];
}
