export interface IWebhookRequest {
  url: string;
  events: string[];
  isActive?: boolean;
}

export interface IUpdateWebhookRequest {
  id: string;
  payload: Partial<IWebhookRequest>;
}
