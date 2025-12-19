export interface IUpdateAffiliateDetailsRequest {
  name: string;
  url: string;
  correspondenceManager: string;
  whiteLabeling?: boolean;
  coBranding?: boolean;
  legalLinks: {
    privacyPolicy: string;
    termsOfService: string;
  };
  communicationTemplates?: string[];
}

