export interface IWebhookResponse {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IGetWebhooksResponse {
  result: IWebhookResponse[];
  message?: string;
  code?: string;
}
