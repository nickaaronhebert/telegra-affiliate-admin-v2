export interface IWebhookResponse {
  id: string;
  name: string;
  url: string;
  affiliate?: string;
  authentication: boolean;
  credentials?: string;
  webhookInterests: string[];
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IGetWebhooksResponse {
  webhooks?: IWebhookResponse[];
  result?: IWebhookResponse[];
  count?: number;
  message?: string;
  code?: string;
}

export interface IWebhookEvent {
  eventSystemName: string;
  eventReadableName: string;
  eventDescription: string;
  categories: string[];
  level: string;
}

export interface IWebhookEventDictionary {
  events: IWebhookEvent[];
}
