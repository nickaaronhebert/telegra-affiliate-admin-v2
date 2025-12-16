export interface Address {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  isDefault: boolean;
  _id: string;
}
export interface User {
  id: string;
  name: string;
  middleName: string;
  picture: string;
  phone: string;
  role: string;
  fullName: string;
  twoFactorType: string;
  status: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  affiliate: string;
}

export interface Patient {
  user: User;
  id: string;
  patientId?: string;
  email: string;
  phone: string;
  phoneNumber?: string;
  firstName: string;
  lastName: string;
  gender?: string;
  dateOfBirth: string;
  createdAt: string;
  updatedAt: string;
  patientMedications: string[];
  medicationAllergies: string[];
  genderBiological: string;
  addresses?: PatientAddress[];
}
export interface Journey {}

export interface LineItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  productVariant?: {
    medicationCatalogue?: {
      drugName?: string;
      dosageForm?: string;
    };
    containerQuantity?: number;
    quantityType?: string;
  };
}

export interface MedicationCatalogue {
  id: string;
  name: string;
  dosage?: string;
  form?: string;
  drugName?: string;
  dosageForm?: string;
}

export interface Order {
  id: string;
  orderId?: string;
  amount?: number;
  patientId: string;
  status: string;
  items: LineItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  sku: string;
}

export interface Provider {
  id: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  phoneNumber?: string;
  specialties?: string[];
}

export interface PatientAddress {
  id: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  country?: string;
  isDefault?: boolean;
}
