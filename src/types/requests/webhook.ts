export interface IWebhookRequest {
  name: string;
  url: string;
  authentication: boolean;
  credentials?: string;
  webhookInterests: string[];
}

export interface IUpdateWebhookRequest {
  id: string;
  payload: Partial<IWebhookRequest>;
}
