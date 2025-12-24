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
import { getLocalStorage } from "@/lib/utils";
import { LOCAL_STORAGE_KEYS } from "@/constants";
import { SendInviteModal } from "./SendInviteModal";
import { useSendQuestionnaireInviteMutation } from "@/redux/services/patient";
import { toast } from "sonner";

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
}

const QuestionnaireItem = ({
  qi,
  patient,
  statusDisplay,
  valid,
  isCompletedExternalQuestionnaireInstance,
  isCompletedQuestionnaireInstance,
  canSendToPatient,
}: QuestionnaireItemProps) => {
  const { id, questionnaire } = qi;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [
    isCompleteQuestionnaireDrawerOpen,
    setIsCompleteQuestionnaireDrawerOpen,
  ] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [sendQuestionnaireInvite, { isLoading: isSendingInvite }] =
    useSendQuestionnaireInviteMutation();

  const getAccessToken = () => {
    const token = getLocalStorage(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    return token || "";
  };

  const getQuestionnaireIframeUrl = () => {
    const patientFrontendUrl = import.meta.env.VITE_PATIENT_FRONTEND_URL;
    const accessToken = getAccessToken();
    return `${patientFrontendUrl}/iframe/questionnaire?id=${qi.id}&iframe=true&access_token=${accessToken}`;
  };

  const handleCompleteQuestionnaire = () => {
    setIsCompleteQuestionnaireDrawerOpen(true);
    // onCompleteQuestionnaire(qi, externalIdentifier);
  };

  const handleSendInvite = async (inviteType: "email" | "sms") => {
    try {
      await sendQuestionnaireInvite({
        patientId: patient.id,
        questionnaireId: qi?.questionnaire?.id,
        data: { inviteType },
      }).unwrap();
      toast.success(`Invitation sent via ${inviteType} successfully!`);
      setIsInviteModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send invitation");
    }
  };

  const openInviteModal = () => {
    setIsInviteModalOpen(true);
  };

  const closeInviteModal = () => {
    setIsInviteModalOpen(false);
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
        <div className="flex gap-2 items-center">
          <span className="text-gray-600 font-medium">
            {questionnaire.title}
          </span>
          <span className={statusDisplay.className}>
            {statusDisplay.displayText}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap flex-col">
        {!valid && (
          <Button
            className={"cursor-pointer text-primary"}
            variant="ghost"
            onClick={handleCompleteQuestionnaire}
          >
            Complete Questionnaire
          </Button>
        )}

        {isCompletedExternalQuestionnaireInstance && (
          <Button
            className={"cursor-pointer text-primary"}
            variant="ghost"
            onClick={() => {
              setIsDrawerOpen(true);
            }}
          >
            View Questionnaire
          </Button>
        )}

        {isCompletedQuestionnaireInstance && (
          <Button
            className={"cursor-pointer text-primary"}
            variant="ghost"
            onClick={() => {
              setIsDrawerOpen(true);
              // onDisplayQuestionnaire(qi);
            }}
          >
            View Questionnaire
          </Button>
        )}

        {canSendToPatient && (
          <Button
            className={"cursor-pointer text-primary"}
            variant="ghost"
            onClick={openInviteModal}
          >
            Send Questionnaire To Patient
          </Button>
        )}
      </div>

      {/* Questionnaire Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent
          side="right"
          className="w-[120vw] sm:w-[600px] lg:w-[900px] max-w-none"
        >
          <div className="h-full flex flex-col">
            <div className="p-1 border-b">
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

      {/* Complete Questionnaire Drawer with iFrame */}
      <Sheet
        open={isCompleteQuestionnaireDrawerOpen}
        onOpenChange={setIsCompleteQuestionnaireDrawerOpen}
      >
        <SheetContent
          side="right"
          className="w-[90vw] sm:w-[600px] lg:w-[800px] max-w-none p-0"
        >
          <div className="h-full flex flex-col">
            <div className="p-1 border-b border-gray-200">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <QuestionnaireSvg color="#3AA5DC" />
                  {questionnaire.title}
                </SheetTitle>
                <SheetDescription>Complete this questionnaire</SheetDescription>
              </SheetHeader>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe
                src={getQuestionnaireIframeUrl()}
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
                className="w-full h-full border-0"
                title="Complete Questionnaire"
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Send Invite Modal */}
      <SendInviteModal
        isOpen={isInviteModalOpen}
        onClose={closeInviteModal}
        onSend={handleSendInvite}
        isLoading={isSendingInvite}
      />
    </div>
  );
};

export default QuestionnaireItem;
