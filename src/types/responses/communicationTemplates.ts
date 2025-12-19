export interface ICommunicationTemplate {
  id: string;
  externalId: string;
  key: string;
  description: string;
  title: string;
  communicationType: string;
  source: string;
  communicationLevel: string;
  allowAffiliateOverride: boolean;
  required: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IViewAllCommunicationTemplatesResponse
  extends Array<ICommunicationTemplate> {}
