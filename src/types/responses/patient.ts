export interface PatientUser {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientAddress {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}
export interface PatientProvider {
  id: string;
  firstName: string;
  lastName: string;
  picture: string;
  fullName: string;
  practitioner: string;
}
export interface PatientPharmacy {
  ctrlIdentifier: null;
  id: string;
  checkForPrescriptionUpdates: boolean;
  sendFaxDocuments: boolean;
  prescriptionDispersementTypes: string[];
  licensedStates: string[];
  blacklistedProductVariations: any[];
  textColor: string;
  backgroundColor: string;
  deleted: boolean;
  name: string;
  pharmacyKey: string;
  faxNumber: string;
  createdAt: string;
  updatedAt: string;
}
export interface PatientPrescription {
  id: string;
  productVariations?: any[];
  refillsAllowed?: number;
  suggestedRefillCount?: number;
  provider?: PatientProvider;
  pharmacy?: PatientPharmacy;
}
export interface Patient {
  id: string;
  email: string;
  phone: string;
  isPhoneValid: boolean;
  firstName: string;
  lastName: string;
  picture: string;
  genderBiological: 'male' | 'female' | 'other';
  height?: number;
  weight?: number;
  bmi?: number;
  dateOfBirth: string;
  orders: any[];
  facetedScores: any[];
  prescriptions?: PatientPrescription[];
  addresses: PatientAddress[];
  affiliates: string[];
  questionnaireInstances: any[];
  user: PatientUser;
  createdAt: string;
  updatedAt: string;
  consent: any;
  patientMedications: any[];
  medicationsConfirmationDate?: string;
  medicationAllergies: any[];
  allergiesConfirmationDate?: string;
}

export interface PatientsResponse {
  result: Patient[];
  count: number;
}

export interface PatientMedication {
  medication: string;
  dosage: string;
  frequency: string;
  conditionPrescribed: string;
  key?: string;
}

export interface MedicationAllergy {
  medicationAllergies: string;
  reaction: string;
  key?: string;
}

export interface PatientOrder {
  id: string;
  orderNumber: string;
  patient: string;
  affiliate: string;
  data: any;
  project: any;
  status: string;
  expedited: boolean;
  productVariations: any[];
  questionnaireInstances: any[];
  fulfilledPrescriptions: any[];
  nonFulfilledPrescriptions: any[];
  rejectedPrescriptions: any[];
  address: any;
  symptoms: any[];
  futurePrescriptions: any[];
  orderTag: string;
  tags: any[];
  titrationFuturePVs: any[];
  createdAt: string;
  updatedAt: string;
  consultationPaymentIntent: any;
  billing?: string
  finalProducts?: string
  prescriptionFulfillments?: any[]
}
export interface PatientLabOrder {
  id: string;
  labOrderNumber: string;
  patient: string;
  affiliate: string;
  status: string;
  lab: string;
  labTests: any[];
  labPanels: any[];
  dispatchStrategy: string;
  order: string
  createdAt: string;
  updatedAt: string;
}
export interface PaymentMethod {
  paymentId: string;
  cardBrand: string;
  last4: string;
  expMonth: string;
  expYear: string;
  isDefault: boolean;
  name: string;
  postalCode: string;
}

export interface PatientDetail {
  id: string;
  email: string;
  phone: string;
  isPhoneValid: boolean;
  firstName: string;
  lastName: string;
  name?: string;
  picture: string;
  gender: string;
  genderBiological: string;
  height: number;
  weight: number;
  bmi: number;
  orders: PatientOrder[];
  labOrders: PatientLabOrder[];
  facetedScores: any[];
  files: any[];
  prescriptions: any[];
  dateOfBirth: string;
  addresses: any[];
  affiliates: string[];
  questionnaireInstances: any[];
  user: string;
  notes: any[];
  createdAt: string;
  updatedAt: string;
  consent: any;
  patientMedications: PatientMedication[];
  medicationAllergies: MedicationAllergy[];
  medicationsConfirmationDate?: string;
  allergiesConfirmationDate?: string;
  payment?: PaymentMethod[];
}

export interface PatientDetailResponse {
  data: PatientDetail;
}

export interface PatientOrdersResponse {
  result: PatientOrder[];
  count: number;
}


export interface PatientPractitioner {
  certificates: TCertificate[];
  createdAt: string;
  deleted: boolean;
  email: string;
  encorePractitioner: boolean;
  firstName: string;
  id: string;
  lastName: string;
  scoring: {
    averageCostEffectivenessScore: number;
    averageResponseTime: number;
    averageResponseTimeScore: number;
    averageScore: number;
    averageVisitRecommendationScore: number;
    averageVisitTypeScore: number;
    visitCount: number;
  };
  speciality: number;
  updatedAt: string;
  user: string;
  picture?: string;
  isAvailable: boolean;
  licencedState?:string
}

export type TCertificate = {
  title: string;
  description: string;
};
