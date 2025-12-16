export interface Product {
  _id: string;
  id: string;
  isAvailable: boolean;
  isActive: boolean;
  potentialConditions: string[];
  deleted: boolean;
  title: string;
  description: string;
  image: string;
  key: string;
  minAge: number;
  maxAge?: number | null;
  createdAt: string;
  updatedAt: string;
  migratedToUnifiedProductLibrary: boolean;
  pricing?: number;
  dosages?: string[];
  concentrations?: any[];
  form?: string;
  priceMapping?: Record<string, string>;
  pretreatmentQuestionnaire?: string;
}

export interface ProductVariation {
  id: string;
  description: string;
  strength: string;
  form: string;
  pricePerUnit: number;
  product: Product;
  subscription: boolean;
  typicalDuration: number;
  categories: any[];
  benefits: any[];
  productVariationWarnings: any[];
  isProviderAdjustmentRequired: boolean;
  tags: string[];
  processedByTelemdnow: boolean;
  woocommerceIds: any[];
  overridingVisitType?: any;
  createdAt: string;
  isActive: boolean;
  updatedAt: string;
  questionnairePreferences: any[];
  commonRefillCount?: number | null;
}

export interface IViewAllProductsInterface {
  productVariations: ProductVariation[];
  count: number;
}