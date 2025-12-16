import QuestionSvg from "@/assets/icons/Question";
import QuestionnaireSvg from "@/assets/icons/Questionnaire";
import type { IQuestionnaireInstance } from "@/types/communicationTemplates";
import type { PatientDetail } from "@/types/responses/patient";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ViewQuestionnaire } from "./ViewQuestionnaire";
import { Button } from "@/components/ui/button";

interface QuestionnaireItemProps {
  qi: IQuestionnaireInstance;
  patient: PatientDetail;
  statusDisplay: {
    className: string;
    displayText: string;
  };
  valid: boolean;
  externalIdentifier?: string;
  isCompletedExternalQuestionnaireInstance: boolean;
  isCompletedQuestionnaireInstance: boolean;
  canSendToPatient: boolean;
  onCompleteQuestionnaire: (
    qi: IQuestionnaireInstance,
    externalIdentifier?: string
  ) => void;
  onOpenTypeFormAnswersDrawer: (qi: IQuestionnaireInstance) => void;
  onDisplayQuestionnaire: (qi: IQuestionnaireInstance) => void;
  onOpenConfirmationModal: (qi: IQuestionnaireInstance) => void;
}

const QuestionnaireItem = ({
  qi,
  patient,
  statusDisplay,
  valid,
  externalIdentifier,
  isCompletedExternalQuestionnaireInstance,
  isCompletedQuestionnaireInstance,
  canSendToPatient,
  onCompleteQuestionnaire,
  onOpenTypeFormAnswersDrawer,
  onDisplayQuestionnaire,
  onOpenConfirmationModal,
}: QuestionnaireItemProps) => {
  const { id, questionnaire } = qi;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleViewQuestionnaire = () => {
    setIsDrawerOpen(true);
    // Call the original handlers for additional logic
    if (isCompletedExternalQuestionnaireInstance) {
      onOpenTypeFormAnswersDrawer(qi);
    } else if (isCompletedQuestionnaireInstance) {
      onDisplayQuestionnaire(qi);
    }
  };

  return (
    <div
      key={id}
      className="p-3 border rounded-lg border-black-100 flex justify-between items-center"
    >
      <div className="flex items-center gap-2 ">
        <div className="bg-[#F0F0F0] w-[42px] h-[42px] flex items-center justify-center">
          <QuestionSvg />
        </div>
        <div className="flex gap-2">
          <span className="text-gray-600 font-medium">
            {questionnaire.title}
          </span>
          <span className={statusDisplay.className}>
            {statusDisplay.displayText}
          </span>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {!valid && (
          <Button
            className={"cursor-pointer text-primary"}
            variant="ghost"
            onClick={() => onCompleteQuestionnaire(qi, externalIdentifier)}
          >
            Complete Questionnaire
          </Button>
        )}

        {isCompletedExternalQuestionnaireInstance && (
          <Button
            className={"cursor-pointer text-primary"}
            variant="ghost"
            onClick={handleViewQuestionnaire}
          >
            View Questionnaire
          </Button>
        )}

        {isCompletedQuestionnaireInstance && (
          <Button
            className={"cursor-pointer text-primary"}
            variant="ghost"
            onClick={handleViewQuestionnaire}
          >
            View Questionnaire
          </Button>
        )}

        {canSendToPatient && (
          <Button
            className={"cursor-pointer text-primary"}
            variant="ghost"
            onClick={() => onOpenConfirmationModal(qi)}
          >
            Send Questionnaire To Patient
          </Button>
        )}
      </div>

      {/* Questionnaire Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent
          side="right"
          className="w-[90vw] sm:w-[600px] lg:w-[800px] max-w-none"
        >
          <div className="h-full flex flex-col">
            <div className="p-2 border-b">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <QuestionnaireSvg color="#3AA5DC" />
                  {questionnaire.title}
                </SheetTitle>
                <SheetDescription>
                  Questionnaire details and responses
                </SheetDescription>
              </SheetHeader>
            </div>
            <div className="flex-1 p-6 overflow-hidden">
              <ViewQuestionnaire questionnaireInstance={qi} patient={patient} />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default QuestionnaireItem;
