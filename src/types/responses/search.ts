export interface SearchPatient {
  _id: string;
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  keywords?: string[];
}

export interface SearchOrder {
  _id: string;
  id: string;
  patient: string;
  status: string;
  affiliate: string;
  orderNumber: string;
  productVariations: Array<{
    name?: string;
    product?: string;
    productName?: string;
  }>;
  keywords?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IGlobalSearchResponse {
  orders: SearchOrder[];
  patients: SearchPatient[];
}
