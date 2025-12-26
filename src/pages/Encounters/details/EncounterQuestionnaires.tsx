import QuestionnaireSvg from "@/assets/icons/Questionnaire";
import {
  QuestionnaireInstanceStatuses,
} from "@/constants";
import type { EncounterDetail } from "@/types/responses/encounter";
import { useMemo } from "react";

interface EncounterQuestionnairesProps {
  encounter: EncounterDetail;
}

// Helper function to get status badge classes and text
const getStatusDisplay = (status: string, valid: boolean) => {
  const isCompleted =
    status === QuestionnaireInstanceStatuses.Completed || valid;
  const className = `px-2 py-1 rounded text-sm flex items-center h-[30px] ${
    isCompleted
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800"
  }`;
  const displayText = valid ? "Completed" : status;
  return { className, displayText };
};

// Helper function to find TypeForm mapping
// const findTypeFormMapping = (qi: IQuestionnaireInstance) => {
//   return qi.externalQuestionnaireMappings?.find(
//     (qm) =>
//       qm.externalQuestionnaire.source === ExternalQuestionnaireSources.TypeForm
//   );
// };

const EncounterQuestionnaires = ({ encounter }: EncounterQuestionnairesProps) => {

  // Memoize container height calculation
  const containerHeight = useMemo(() => {
    return encounter?.questionnaireInstances?.length ? "h-[350px]" : "h-[200px]";
  }, [encounter?.questionnaireInstances?.length]);

  return (
    <div
      id="encounterQuestionnairesInformation"
      className="bg-white rounded-[10px] shadow-[0px_2px_40px_0px_#00000014] p-6 mb-2.5 "
    >
      <div className="flex gap-2 items-center border-b border-card-border justify-between align-middle pb-2">
        <div className="flex gap-2 items-center">
          <QuestionnaireSvg color="#000000" width={18} height={18} />
          <h1 className="text-base font-bold "> Patient Questionnaires</h1>
        </div>
      </div>
      <div className="mt-3">
        <div
          className={`bg-white shadow-[0px_2px_40px_0px_#00000014] pb-[12px] overflow-y-auto rounded-lg ${containerHeight}`}
        >
          <div className="flex flex-col gap-4 p-2">
            {encounter?.questionnaireInstances?.map(
              (qi: any) => {
                const {
                  id,
                  questionnaire,
                  status,
                  valid,
                } = qi;

                // Pre-calculate all conditions using helper functions
                const statusDisplay = getStatusDisplay(status, valid);

                return (
                  <div key={id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="text-sm font-medium">{questionnaire?.title || "Questionnaire"}</div>
                    <div className={statusDisplay.className}>{statusDisplay.displayText}</div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EncounterQuestionnaires;
