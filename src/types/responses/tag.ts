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

// Compact tag type for product tags
export interface ICompactTag {
  id: string;
  name: string;
  color: string;
}

export type ICompactTagsResponse = ICompactTag[];

export interface IAssignTagsResponse {
  success: boolean;
  message?: string;
}
