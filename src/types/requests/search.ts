export type PharmacyConnectionStatus =
  | "connected"
  | "not_connected"
  | "requested";

export interface ICommonSearchQuery {
  page: number;
  perPage: number;
  q?: string;
  name?: string;
  patient?: string;
  type?:
    | "Prescription"
    | "Order"
    | "Transmission"
    | "AccessControl"
    | "ProductVariant"
    | "Invitation"
    | "Provider Group Invitation"
    | "Payment";
  startDate?: string;
  endDate?: string;
  status?: string;
  connectionStatus?: PharmacyConnectionStatus;
  organization?: string;
  pharmacy?: string;
  state?: string;
  subOrganization?: string;
  organizationId?: string;
  orderid?: string;
}
