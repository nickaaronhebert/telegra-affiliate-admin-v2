import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { EncounterDetail, QuestionnaireInstance } from "@/types/responses/encounter";
import QuestionSvg from "@/assets/icons/Question";
import { useAttachQuestionnaireToEncounterMutation } from "@/redux/services/encounter";
import { toast } from "sonner";
import { useState } from "react";

interface AttachQuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableQuestionnaires: QuestionnaireInstance[];
  encounter: EncounterDetail;
}

export function AttachQuestionnaireModal({
  isOpen,
  onClose,
  availableQuestionnaires,
  encounter,
}: AttachQuestionnaireModalProps) {
  const [loadingQuestionnaireId, setLoadingQuestionnaireId] = useState<string | null>(null);
  const [attachQuestionnaireToEncounter, { isLoading }] =
    useAttachQuestionnaireToEncounterMutation();

  const handleAttach = async (questionnaire: QuestionnaireInstance) => {
    try {
      setLoadingQuestionnaireId(questionnaire.id);
      
      // Build the questionnaireInstances array
      const existingIds = encounter.questionnaireInstances?.map((qi) => qi.id) || [];
      const questionnaireInstanceIds = [...existingIds, questionnaire.id];

      await attachQuestionnaireToEncounter({
        encounterId: encounter.id,
        questionnaireInstanceIds,
      }).unwrap();

      toast.success("Questionnaire attached successfully");
      onClose();
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to attach questionnaire"
      );
    } finally {
      setLoadingQuestionnaireId(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full !max-w-[500px] p-5">
        <DialogHeader>
          <DialogTitle>Attach Questionnaire</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {availableQuestionnaires.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No questionnaires available
            </div>
          ) : (
            availableQuestionnaires.map((qi: QuestionnaireInstance) => (
              <div
                key={qi.id}
                className="flex items-center justify-between p-4 border  rounded-lg  transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 bg-gray-200">
                    <QuestionSvg />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {qi.questionnaire?.title || "Untitled Questionnaire"}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => handleAttach(qi)}
                  disabled={isLoading || loadingQuestionnaireId === qi.id}
                  className="ml-2 px-4 py-1 text-xs font-semibold bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded cursor-pointer flex-shrink-0"
                >
                  {loadingQuestionnaireId === qi.id ? "ATTACHING..." : "ATTACH"}
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
