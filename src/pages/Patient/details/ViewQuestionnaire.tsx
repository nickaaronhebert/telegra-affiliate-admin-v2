import type { IQuestionnaireInstance } from "@/types/communicationTemplates";
import type { PatientDetail } from "@/types/responses/patient";
import { Response } from "./Response";

interface ViewQuestionnaireProps {
  questionnaireInstance: IQuestionnaireInstance;
  patient: PatientDetail;
}

export const ViewQuestionnaire = ({
  questionnaireInstance,
}: ViewQuestionnaireProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-6">
        {questionnaireInstance.responses?.map((response, index) => (
          <div
            key={index}
            className="border-b border-gray-100 pb-6 last:border-b-0"
          >
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">
                {response.location?.data?.label}
              </h2>
              {response.location?.data?.description && (
                <div className="text-sm text-gray-600 mb-3">
                  {response.location.data.description
                    .split("\n")
                    .map((line: string, lineIndex: number) => (
                      <div key={lineIndex}>{line}</div>
                    ))}
                </div>
              )}
              <Response
                location={response?.location as any}
                response={response as any}
              />
            </div>
          </div>
        ))}

        {(!questionnaireInstance.responses ||
          questionnaireInstance.responses.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            No responses available
          </div>
        )}
      </div>
    </div>
  );
};
