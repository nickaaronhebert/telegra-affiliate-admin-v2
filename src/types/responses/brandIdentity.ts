export interface IBrandIdentityAffiliate {
  id: string;
  name: string;
  email: string;
}

export interface IBrandIdentityColor {
  category: string;
  variableName: string;
  variableValue: string;
}

export interface IBrandIdentityEmbeddedStyle {
  elementType: string;
  elementIdentifier: string;
  backgroundImages: string[];
  backgroundType: string;
  colors: IBrandIdentityColor[];
  fontFamilies: string[];
}

export interface IGetBrandIdentityResponse {
  id: string;
  affiliate: IBrandIdentityAffiliate;
  appName: string;
  appTagline: string;
  appLogo: string;
  embeddedStyles: IBrandIdentityEmbeddedStyle[];
  hiddenNavTabs: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IUpdateBrandIdentityRequest {
  appName: string;
  appTagline?: string;
  appLogo?: string;
  embeddedStyles: IBrandIdentityEmbeddedStyle[];
}

export interface IUpdateBrandIdentityResponse extends IGetBrandIdentityResponse {}

export interface IFrontendConfigurationAffiliate {
  _id: string;
  name: string;
  email: string;
}

export interface IFrontendConfigurationFontFamily {
  category: string;
  variableName: string;
  variableValue: string;
}

export interface IFrontendConfigurationEmbeddedStyle {
  elementType: string;
  elementIdentifier: string;
  styleValue: string;
  backgroundImages: string[];
  backgroundType: string;
  buttonsBorderRadius: string;
  inputsBorderColor: string;
  colors: IBrandIdentityColor[];
  fontFamilies: IFrontendConfigurationFontFamily[];
  dashboardImage?: string;
  completedScreenImage?: string;
  selectButtonRadius?: string;
  closingScreen?: string;
}

export interface IProgressBar {
  progressBarType: string;
  progressSteps: string[];
}

export interface IGetFrontendConfigurationResponse {
  _id: string;
  appName: string;
  appTagline: string;
  appLogo: string;
  smallAppLogo: string;
  logoWithName: boolean;
  embeddedStyles: IFrontendConfigurationEmbeddedStyle[];
  hiddenNavTabs: string[];
  progressBar: IProgressBar;
  brandingLogo: string;
  smallBrandingLogo: string;
  affiliate: IFrontendConfigurationAffiliate;
  createdAt: string;
  updatedAt: string;
}

export interface IUploadLogoRequest {
  picture: {
    fileData: string;
    fileName: string;
  };
}

export interface IUploadLogoResponse {
  id: string;
  name: string;
  email: string;
  picture: string;
}
