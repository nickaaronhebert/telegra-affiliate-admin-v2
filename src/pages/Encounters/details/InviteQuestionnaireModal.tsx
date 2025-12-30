import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useGetQuestionnairesQuery } from "@/redux/services/questionnaire";
import { useInviteQuestionnaireToEncounterMutation } from "@/redux/services/encounter";
import type { EncounterDetail } from "@/types/responses/encounter";

// Zod schema for the form
const inviteQuestionnaireSchema = z.object({
  questionnaire: z.string().min(1, "Please select a questionnaire"),
});

type InviteQuestionnaireFormData = z.infer<typeof inviteQuestionnaireSchema>;

interface InviteQuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  encounter: EncounterDetail;
}

export function InviteQuestionnaireModal({
  isOpen,
  onClose,
  encounter,
}: InviteQuestionnaireModalProps) {
  const form = useForm<InviteQuestionnaireFormData>({
    resolver: zodResolver(inviteQuestionnaireSchema),
    defaultValues: {
      questionnaire: "",
    },
  });

  const { data: questionnairesData = [], isLoading: isLoadingQuestionnaires } =
    useGetQuestionnairesQuery({
      page: 1,
      limit: 100,
    });

  const [inviteQuestionnaireToEncounter, { isLoading: isSendingInvite }] =
    useInviteQuestionnaireToEncounterMutation();

  // Filter only active questionnaires
  const activeQuestionnaires = questionnairesData.filter(
    (q) => q.active === true
  );

  useEffect(() => {
    if (isOpen) {
      form.reset({
        questionnaire: "",
      });
    }
  }, [isOpen, form]);

  const onSubmit = async (data: InviteQuestionnaireFormData) => {
    try {
      if (!encounter?.patient?.id || !encounter?.id) {
        toast.error("Patient or encounter information not found");
        return;
      }

      await inviteQuestionnaireToEncounter({
        encounterId: encounter.id,
        patientId: encounter.patient.id,
        questionnaireId: data.questionnaire,
      }).unwrap();

      toast.success("Questionnaire invite sent successfully");
      onClose();
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to send questionnaire invite"
      );
    }
  };

  const handleClose = () => {
    form.reset({
      questionnaire: "",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full !max-w-[600px] p-5">
        <DialogHeader className="pb-4">
          <DialogTitle>Invite Patient to Complete Questionnaire</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="questionnaire"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Questionnaire</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoadingQuestionnaires}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a questionnaire..." />
                      </SelectTrigger>
                      <SelectContent>
                        {activeQuestionnaires.length === 0 ? (
                          <div className="p-2 text-sm text-gray-500">
                            No questionnaires available
                          </div>
                        ) : (
                          activeQuestionnaires.map((questionnaire) => (
                            <SelectItem
                              key={questionnaire.id}
                              value={questionnaire.id}
                            >
                              {questionnaire.title}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSendingInvite}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary text-white cursor-pointer"
                disabled={isSendingInvite || isLoadingQuestionnaires}
              >
                {isSendingInvite ? "Sending..." : "Send Invite"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
