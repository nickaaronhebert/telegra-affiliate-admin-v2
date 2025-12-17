export interface ITagScope {
  targetModel: string;
  owner: {
    model: string;
    id: string;
  };
}

export interface ICreateTagRequest {
  name: string;
  description?: string;
  color: string;
  scope: ITagScope;
}

export interface IUpdateTagRequest extends Partial<ICreateTagRequest> {
  id: string;
}
