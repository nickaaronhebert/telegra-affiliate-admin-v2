export interface IProject {
  id: string;
  name: string;
  description?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type IGetProjectsResponse = IProject[];

export type IGetProjectByIdResponse = IProject;
