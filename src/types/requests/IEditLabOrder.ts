import type { ADDRESS } from "@/redux/slices/create-order";

export interface IEditLabOrderRequest {
  patient: string;
  address: {
    billing: ADDRESS;
    shipping: ADDRESS;
  };
  affiliate: string;
  lab: string;
  labPanels: string[];
  createOrderAfterResults: boolean;
  afterResultsOrderProductVariations?: {
    productVariation: string;
    quantity: number;
  }[];
  labOrderId: string;
}
