import type { PAYMENT_MECHANISMS } from "@/constants";

type PaymentMechanismType =
  (typeof PAYMENT_MECHANISMS)[keyof typeof PAYMENT_MECHANISMS];

export interface EncounterUser {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface EncounterAddress {
  _id: string;
  owner: string;
  defaultAddress: boolean;
  billing: {
    address1: string;
    address2?: string;
    city: string;
    state?: {
      _id: string;
      isSupported: boolean;
      deleted: boolean;
      name: string;
      abbreviation: string;
      createdAt: string;
      minimumVisitType: string;
      updatedAt: string;
      id: string;
    };
    zipcode: string;
    createdAt: string;
    updatedAt: string;
    id: string;
  };
  shipping: {
    address1: string;
    address2?: string;
    city: string;
    state?: {
      _id: string;
      isSupported: boolean;
      deleted: boolean;
      name: string;
      abbreviation: string;
      createdAt: string;
      minimumVisitType: string;
      updatedAt: string;
      id: string;
    };
    zipcode: string;
    createdAt: string;
    updatedAt: string;
    id: string;
  };
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  id: string;
}

export interface EncounterProvider {
  id: string;
  firstName: string;
  lastName: string;
  picture: string;
  fullName: string;
  practitioner: string;
}

export interface EncounterEventData {
  [key: string]: any;
}

export interface EncounterEvent {
  _id: string;
  ownerEntity: string;
  ownerEntityModel: string;
  targetEntity: string;
  targetEntityModel: string;
  eventTitle: string;
  eventType: string;
  eventDescription?: string;
  eventData: EncounterEventData;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  id: string;
}

export interface EncounterLabOrder {
  id: string;
  labOrderNumber: string;
  encounter: string;
  status: string;
  lab: string;
  labTests: any[];
  labPanels: any[];
  dispatchStrategy: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionnaireResponse {
  _id?: string;
  question?: string;
  response?: string;
  [key: string]: any;
}

export interface ExternalQuestionnaireMappingData {
  _id?: string;
  externalQuestionnaire?: {
    source: string;
    externalIdentifier: string;
  };
  [key: string]: any;
}

export interface QuestionnaireInstance {
  _id: string;
  questionnaire?: {
    substitutableQuestionnaires?: any[];
    _id: string;
    active: boolean;
    deleted: boolean;
    title: string;
    createdAt: string;
    updatedAt: string;
    questionnaireVariables?: any[];
    locations?: any[];
    id: string;
  };
  patient: string;
  patientModel: string;
  originatingOrder?: string;
  valid: boolean;
  expiresAt?: string;
  status: string;
  affiliate?: string | null;
  questionnaireType: string;
  validationDisabled: boolean;
  deleted: boolean;
  questionnaireResolvedVariables?: any[];
  createdAt: string;
  updatedAt: string;
  currentLocation?: string | null;
  responses?: QuestionnaireResponse[];
  externalQuestionnaireMappings?: ExternalQuestionnaireMappingData[];
  id: string;
}

export interface ProductVariationItem {
  productVariation: {
    _id: string;
    subscription: boolean;
    tags: any[];
    isProviderAdjustmentRequired: boolean;
    woocommerceIds: any[];
    processedByTelemdnow: boolean;
    isActive: boolean;
    categories: any[];
    benefits: any[];
    productVariationWarnings: any[];
    productVariationFlow: string;
    isFillable: boolean;
    deleted: boolean;
    keywords: string[];
    description: string;
    strength: string;
    form: string;
    pricePerUnit: number;
    product: {
      [key: string]: any;
      id: string;
    };
    typicalDuration: number;
    commonRefillCount: number;
    questionnairePreferences: any[];
    createdAt: string;
    updatedAt: string;
    overridingVisitType: any;
    prerequisites: any[];
    id: string;
  };
  quantity: number;
}

export interface PaymentIntentData {
  _id: string;
  paymentIntent: string;
  customer: any;
  user: string;
  paymentMethod: any;
  order: string;
  amount: number;
  currency: string;
  status: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  id: string;
}

export interface PatientForEncounter {
  id: string;
  email: string;
  phone: string;
  isPhoneValid: boolean;
  firstName: string;
  lastName: string;
  picture: string;
  genderBiological: "male" | "female" | "other";
  gender?: string;
  height?: number;
  weight?: number;
  bmi?: number;
  dateOfBirth: string;
  affiliates: string[];
  user: string;
  status: string;
  role: string;
  consent: any;
  patientMedications: any[];
  medicationAllergies: any[];
  deleted: boolean;
  keywords: string[];
  facetedScores: any[];
  createdAt: string;
  updatedAt: string;
  name: string;
  medicationsConfirmationDate?: string;
  allergiesConfirmationDate?: string;
  addresses: EncounterAddress[];
}

export interface AffiliateData {
  id: string;
  name: string;
  picture: string;
  affiliateKey: string;
  globalProductVariationAllowances: string[];
  communicationTemplates: string[];
  iasDomain: string;
  url: string;
  correspondenceManager: string;
  correspondenceExternalUrl: string;
  allowAccountCreation: boolean;
  affiliateChatSystem: boolean;
  affiliateChatSystemEnabledChats: any[];
  affiliateChatSystemEnabledMessaging: any[];
  frontendConfiguration: {
    appName: string;
    appLogo: string;
    smallAppLogo: string;
    logoWithName: boolean;
    embeddedStyles: any[];
    hiddenNavTabs: any[];
    progressBar: {
      progressBarType: string;
      progressSteps: any[];
    };
    brandingLogo: string;
    smallBrandingLogo: string;
  };
  whiteLabeling: boolean;
  coBranding: boolean;
  useAffiliateLogoOnPrescription: boolean;
  ecommerceModuleEnabled: boolean;
  ecommercePlatform: string;
  appLanguage: string;
  pharmacyProfiles: any[];
  legalLinks: {
    privacyPolicy: string;
    termsOfService: string;
  };
  telegraECommerceStoreUrl: string;
  ctrlServiceEnabled: boolean;
  workflowsEnabled: boolean;
}

export interface ProjectData {
  elevateOnDisqualifier: boolean;
  _id: string;
  title: string;
  paymentMechanism: PaymentMechanismType;
  affiliate: string;
  waitingRoomRequired: boolean;
  productsToTriggerWaitingRoom: any[];
  default: boolean;
  paymentStrategy: {
    paymentMechanism: PaymentMechanismType;
    asynchronousBillPriceToUser: number;
    asynchronousBillPriceToAffiliate: number;
    synchronousBillPriceToUser: number;
    synchronousBillPriceToAffiliate: number;
    processOrderPaymentForAffiliate: boolean;
  };
  assignedPractitioners: any[];
  refillManager: string;
  orderAutoSubmissionEnabled: boolean;
  orderAutoSubmissionPvsDisabled: any[];
  orderAutoSubmissionOnRefills: boolean;
  deleted: boolean;
  productVariationsToTriggerSynchronousVisitType: any[];
  createdAt: string;
  updatedAt: string;
  id: string;
  affiliateApprovalRequired?: boolean;
  prescriptionDispersementMechanism?: string;
  telegraApprovalRequired?: boolean;

}

export interface EncounterDetail {
  id: string;
  orderNumber: string;
  patient: PatientForEncounter;
  affiliate: AffiliateData;
  project: ProjectData;
  status: string;
  history: EncounterEvent[];
  prerequisiteInstances: any[];
  questionnaireInstances: QuestionnaireInstance[];
  productVariations: ProductVariationItem[];
  address: EncounterAddress;
  prescriptionFulfillments: any[];
  consultationPaymentIntent: PaymentIntentData;
  errors: any[];
  createdAt: string;
  updatedAt: string;
  symptoms: any[];
  siblingLabOrders: any[];
  reminderCreationDate: string;
  tags: any[];
  labOrders?: EncounterLabOrder[];
  files?: any[];
  notes?: any[];
  affiliateApprovalDate?: string;
  telegraApprovalDate?: string;

}

export interface Encounter {
  id: string;
  orderNumber: string;
  patient: PatientForEncounter;
  affiliate: AffiliateData;
  project: ProjectData;
  status: string;
  history: EncounterEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface EncountersResponse {
  result: Encounter[];
  count: number;
}
