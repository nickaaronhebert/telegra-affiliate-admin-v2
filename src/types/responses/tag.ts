export interface ITagScope {
  targetModel: string;
  owner: {
    model: string;
    id: string;
  };
}

export interface ITag {
  id: string;
  name: string;
  description?: string;
  color: string;
  scope: ITagScope;
  createdAt?: string;
  updatedAt?: string;
}

export type IViewAllTagsResponse = ITag[];

export type IGetTagByIdResponse = ITag;

export interface ICreateTagResponse {
  id: string;
  name: string;
  description?: string;
  color: string;
  scope: ITagScope;
  createdAt: string;
  updatedAt: string;
}
