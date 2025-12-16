export interface ProductVariation {
  productVariation: {
    id: string;
    [key: string]: any;
  };
  quantity: number;
  pricePerUnitOverride: number;
  billingCycleLength: number;
}

export interface PreCheckoutQuestionnaire {
  questionnaire: {
    id: string;
    [key: string]: any;
  };
  isPreAuthQuestionnaire: boolean;
}

export interface JourneyTemplate {
  _id: string;
  id: string;
  affiliate: string;
  name: string;
  slug: string;
  productVariations: ProductVariation[];
  preCheckoutQuestionnaire: PreCheckoutQuestionnaire[];
  deleted: boolean;
  steps: any[];
  createdAt: string;
  updatedAt: string;
}

export interface IViewAllJourneyInterface {
  result: JourneyTemplate[];
  count: number;
}
