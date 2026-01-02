export interface BrandColors {
  primary: string;
  accent: string;
  neutral: string;
}

export interface JourneyTheme {
  layout: string;
  inheritFromAffiliate: boolean;
  brandColors: BrandColors;
}

export interface ICreateJourneyRequest {
  affiliate: string;
  name: string;
  productVariations: {
    productVariation: string;
    quantity: number;
    pricePerUnitOverride?: number;
    billingCycleLength?: number;
  }[];
  preCheckoutQuestionnaire: {
    questionnaire: string;
    isPreAuthQuestionnaire: boolean;
  }[];
  theme?: JourneyTheme;
  metadata?: Record<string, any>;
}
