export interface IEmbeddedStyleColor {
  category: string;
  variableName: string;
  variableValue: string;
}

export interface IEmbeddedStyleFontFamily {
  category: string;
  variableName: string;
  variableValue: string;
}

export interface IEmbeddedStyle {
  elementType: string;
  elementIdentifier: string;
  styleValue: string;
  backgroundImages: string[];
  backgroundType: string;
  buttonsBorderRadius: string;
  inputsBorderColor: string;
  colors: IEmbeddedStyleColor[];
  fontFamilies: IEmbeddedStyleFontFamily[];
  dashboardImage?: string;
  completedScreenImage?: string;
  selectButtonRadius?: string;
  closingScreen?: string;
}

export interface IProgressBar {
  progressBarType: string;
  progressSteps: any[];
}

export interface IFrontendConfiguration {
  appName: string;
  appLogo: string;
  smallAppLogo: string;
  logoWithName: boolean;
  embeddedStyles: IEmbeddedStyle[];
  hiddenNavTabs: any[];
  progressBar: IProgressBar;
  brandingLogo: string;
  smallBrandingLogo: string;
}

export interface ILegalLinks {
  privacyPolicy: string;
  termsOfService: string;
}

export interface IAffiliateSettings {
  participantIdentifier: string;
  participantSecondaryIdentifier: string;
}

export interface IGetAffiliateDetailsResponse {
  id: string;
  name: string;
  picture: string | null;
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
  frontendConfiguration: IFrontendConfiguration;
  whiteLabeling: boolean;
  coBranding: boolean;
  useAffiliateLogoOnPrescription: boolean;
  ecommerceModuleEnabled: boolean;
  ecommercePlatform: string;
  appLanguage: string;
  pharmacyProfiles: any[];
  legalLinks: ILegalLinks;
  telegraECommerceStoreUrl: string;
  ctrlServiceEnabled: boolean;
  workflowsEnabled: boolean;
  data: Record<string, any>;
  settings: IAffiliateSettings;
  email: string;
  createdAt: string;
  status: string;
}

export interface IUpdateAffiliateDetailsResponse extends IGetAffiliateDetailsResponse {}
