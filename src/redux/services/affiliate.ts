import { baseApi } from ".";
import { TAG_AFFILIATE_DETAILS } from "@/types/baseApiTags";

export interface AffiliateMe {
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
  affiliateChatSystemEnabledChats: string[];
  affiliateChatSystemEnabledMessaging: string[];
  frontendConfiguration: {
    appName: string;
    appLogo: string;
    smallAppLogo: string;
    logoWithName: boolean;
    embeddedStyles: any[];
    hiddenNavTabs: string[];
    progressBar: any;
    brandingLogo: string;
    smallBrandingLogo: string;
  };
  whiteLabeling: boolean;
  coBranding: boolean;
  useAffiliateLogoOnPrescription: boolean;
  ecommerceModuleEnabled: boolean;
  ecommercePlatform: string;
  appLanguage: string;
  pharmacyProfiles: string[];
  legalLinks: {
    privacyPolicy: string;
    termsOfService: string;
  };
  telegraECommerceStoreUrl: string;
  ctrlServiceEnabled: boolean;
  workflowsEnabled: boolean;
  data: Record<string, any>;
  settings: {
    participantIdentifier: string;
    participantSecondaryIdentifier: string;
  };
  email: string;
  createdAt: string;
  status: string;
}

const affiliateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAffiliateMe: builder.query<AffiliateMe, void>({
      query: () => ({
        url: "/affiliates/me",
        method: "GET",
      }),
      providesTags: [TAG_AFFILIATE_DETAILS],
    }),
  }),
});

export const { useGetAffiliateMeQuery } = affiliateApi;
export default affiliateApi;
