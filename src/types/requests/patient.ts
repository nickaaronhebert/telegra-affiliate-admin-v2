export interface IViewAllPatientsRequest {
  page?: number;
  limit?: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface IUpdatePatientMedicationsRequest {
  patientMedications: {
    medication: string;
    dosage: string;
    frequency: string;
    conditionPrescribed: string;
    key?: string;
  }[];
  medicationsConfirmationDate: string;
}

export interface IUpdatePatientAllergiesRequest {
  medicationAllergies: {
    medicationAllergies: string;
    reaction: string;
    key?: string;
  }[];
  allergiesConfirmationDate: string;
}

export interface ISendOrderInviteRequest {
  inviteType: 'email' | 'sms';
}

export interface ISendQuestionnaireInviteRequest {
  id: string;
  questionnaire: string;
  inviteType: 'email' | 'sms';
}

export interface IUpdatePatientRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  genderBiological: 'male' | 'female';
  gender?: 'male' | 'female';
  email: string;
  phone: string;
  height?: string;
  weight?: string;
}

export interface IViewPatientOrdersRequest {
  patientId: string;
}

export interface IUploadPatientFileRequest {
  file: File;
}