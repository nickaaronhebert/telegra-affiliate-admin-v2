
export interface ICreateJourneyRequest {
  affiliate: string;
  name: string;
  productVariations: {
    productVariation: string;
    quantity: number;
    pricePerUnitOverride: number;
    billingCycleLength?: number;
  }[];
  preCheckoutQuestionnaire: {
    questionnaire: string;
    isPreAuthQuestionnaire: boolean;
  }[];
}
