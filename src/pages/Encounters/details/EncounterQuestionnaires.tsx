import QuestionnaireSvg from "@/assets/icons/Questionnaire";
import {
  ExternalQuestionnaireSources,
  QuestionnaireInstanceStatuses,
  CommunicationTemplateKeys,
  postPractitionerReviewOrderStatuses,
} from "@/constants";
import { useCommunicationTemplate } from "@/hooks/useCommunicationTemplate";
import type { EncounterDetail } from "@/types/responses/encounter";
import type { IQuestionnaireInstance } from "@/types/communicationTemplates";
import { useMemo, useState } from "react";
import QuestionnaireItem from "@/pages/Patient/details/QuestionnaireItem";
import { Button } from "@/components/ui/button";
import { InviteQuestionnaireModal } from "./InviteQuestionnaireModal";
import { AttachQuestionnaireModal } from "./AttachQuestionnaireModal";
import type { PatientDetail } from "@/types/responses/patient";

interface EncounterQuestionnairesProps {
  encounter: EncounterDetail;
  patient?: PatientDetail;
}

// Helper function to get status badge classes and text
const getStatusDisplay = (status: string, valid: boolean) => {
  const isCompleted =
    status === QuestionnaireInstanceStatuses.Completed || valid;
  const className = `px-2 py-1 rounded text-sm flex items-center h-[30px] capitalize ${
    isCompleted
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800"
  }`;
  const displayText = valid ? "Completed" : status;
  return { className, displayText };
};

// Helper function to find TypeForm mapping
const findTypeFormMapping = (qi: IQuestionnaireInstance) => {
  return qi.externalQuestionnaireMappings?.find(
    (qm) =>
      qm.externalQuestionnaire.source === ExternalQuestionnaireSources.TypeForm
  );
};

const EncounterQuestionnaires = ({
  encounter,
  patient,
}: EncounterQuestionnairesProps) => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);
  const isActiveInviteTemplate = useCommunicationTemplate(
    CommunicationTemplateKeys.INVITE_PATIENT_COMPLETE_QUESTIONNAIRE
  );

  // Memoize container height calculation
  const containerHeight = useMemo(() => {
    return encounter?.questionnaireInstances?.length
      ? "h-[350px]"
      : "h-[200px]";
  }, [encounter?.questionnaireInstances?.length]);

  // Get questionnaires available for attachment (not already in encounter)
  const availableQuestionnairesForAttachment = useMemo(() => {
    if (!patient?.questionnaireInstances) {
      return [];
    }

    const encounterQuestionnaireIds =
      encounter?.questionnaireInstances?.map((qi) => qi.id) || [];

    return patient.questionnaireInstances.filter(
      (qi) => !encounterQuestionnaireIds.includes(qi.id)
    );
  }, [patient?.questionnaireInstances, encounter?.questionnaireInstances]);
  const canAddQuestionnaires =
    encounter?.status &&
    !postPractitionerReviewOrderStatuses.includes(encounter?.status as any);
  return (
    <>
      <div
        id="encounterQuestionnairesInformation"
        className="bg-white rounded-[10px] shadow-[0px_2px_40px_0px_#00000014] p-6 mb-2.5 "
      >
        <div className="flex gap-2 items-center border-b border-card-border justify-between align-middle pb-2">
          <div className="flex gap-2 items-center">
            <QuestionnaireSvg color="#000000" width={18} height={18} />
            <h1 className="text-base font-bold ">Patient Questionnaires</h1>
          </div>
          {canAddQuestionnaires && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => setIsInviteModalOpen(true)}
              >
                Invite to Complete Questionnaire
              </Button>
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => setIsAttachModalOpen(true)}
                disabled={availableQuestionnairesForAttachment.length === 0}
                title={
                  availableQuestionnairesForAttachment.length === 0
                    ? "No questionnaires available"
                    : ""
                }
              >
                Attach Questionnaire
              </Button>
            </div>
          )}
        </div>
        <div className="mt-3">
          <div
            className={`bg-white shadow-[0px_2px_40px_0px_#00000014] pb-[12px] overflow-y-auto rounded-lg ${containerHeight}`}
          >
            <div className="flex flex-col gap-4 p-2">
              {encounter?.questionnaireInstances?.map((qi: any) => {
                const {
                  id,
                  questionnaire,
                  status,
                  valid,
                  externalQuestionnaireInstance,
                  responses,
                } = qi;

                // Pre-calculate all conditions using helper functions
                const isInternalQuestionnaireAvailable = Boolean(
                  questionnaire?.locations?.length
                );
                const externalQuestionnaireMapping = findTypeFormMapping(qi);
                const externalIdentifier =
                  externalQuestionnaireMapping?.externalQuestionnaire
                    .externalIdentifier;

                const isCompletedQuestionnaireInstance =
                  status === QuestionnaireInstanceStatuses.InProgress && valid;

                const isCompletedExternalQuestionnaireInstance =
                  !responses?.length &&
                  Boolean(externalQuestionnaireMapping) &&
                  isCompletedQuestionnaireInstance &&
                  Boolean(
                    externalQuestionnaireInstance?.data?.form_response?.answers
                      ?.length
                  );

                const canSendToPatient =
                  isActiveInviteTemplate &&
                  !isCompletedQuestionnaireInstance &&
                  (isInternalQuestionnaireAvailable ||
                    Boolean(externalQuestionnaireMapping));

                const statusDisplay = getStatusDisplay(status, valid);

                return (
                  <QuestionnaireItem
                    key={id}
                    qi={qi}
                    patient={encounter.patient as any}
                    statusDisplay={statusDisplay}
                    valid={valid}
                    externalIdentifier={externalIdentifier}
                    isCompletedExternalQuestionnaireInstance={
                      isCompletedExternalQuestionnaireInstance
                    }
                    isCompletedQuestionnaireInstance={
                      isCompletedQuestionnaireInstance
                    }
                    canSendToPatient={canSendToPatient}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <InviteQuestionnaireModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        encounter={encounter}
      />
      <AttachQuestionnaireModal
        isOpen={isAttachModalOpen}
        onClose={() => setIsAttachModalOpen(false)}
        availableQuestionnaires={availableQuestionnairesForAttachment}
        encounter={encounter}
      />
    </>
  );
};

export default EncounterQuestionnaires;
