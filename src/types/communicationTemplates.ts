export interface ICommunicationTemplate {
  id: string;
  key: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IUser {
  id: string;
  email: string;
  communicationTemplates: string[];
  // Add other user properties as needed
}

export interface IQuestionnaireInstance {
  id: string;
  questionnaire: {
    id: string;
    title: string;
    locations?: any[];
  };
  status: string;
  valid: boolean;
  createdAt?: string;
  expiresAt?: string;
  responses?: Array<{
    value: string | string[];
    data?: {
      agreementData?: {
        signature: string;
      };
      values?: any[];
    };
    files?: Array<{
      url: string;
      name: string;
      format: string;
    }>;
    location: {
      locationType: string;
      data: {
        type: string;
        label?: string;
        description?: string;
        mode?: string;
        props?: {
          options?: Array<{
            value: string;
            label: string;
          }>;
          columns?: Array<{
            label: string;
            value: string;
          }>;
        };
      };
    };
  }>;
  externalQuestionnaireInstance?: {
    data?: {
      form_response?: {
        answers?: any[];
      };
    };
  };
  externalQuestionnaireMappings?: Array<{
    externalQuestionnaire: {
      source: string;
      externalIdentifier: string;
    };
  }>;
}