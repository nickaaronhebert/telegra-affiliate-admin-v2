export interface Questionnaire {
  id: string;
  title: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetQuestionnairesRequest {
  page?: number;
  limit?: number;
  q?: string;
}

export interface QuestionnairesResponse {
  questionnaires: Questionnaire[];
  count: number;
  page: number;
  limit: number;
}