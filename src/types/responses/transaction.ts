export interface TransactionPaymentMethod {
  paymentId: string;
  type: string;
  number?: string;
  valid?: string;
  owner?: string;
  address?: string;
}

export interface PaymentMethodDetails {
  paymentId: string;
  cardBrand: string;
  last4: string;
  expMonth: string;
  expYear: string;
  isDefault: boolean;
  name: string;
  postalCode: string;
}

export interface TransactionPaymentDetails {
  paymentMechanism: string;
  amount: number;
  status: string;
}

export interface TransactionPatient {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  [key: string]: any;
}

export interface TransactionOrder {
  _id: string;
  orderNumber: string;
  patient: TransactionPatient;
  [key: string]: any;
}

export interface Transaction {
  id: string;
  paymentIntent: string;
  customer: any;
  user: string;
  paymentMethod: string;
  order: TransactionOrder;
  amount: number;
  currency: string;
  status: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}
