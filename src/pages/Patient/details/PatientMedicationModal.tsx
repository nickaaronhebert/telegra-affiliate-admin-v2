import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { PatientMedication } from "@/types/responses/patient";

const medicationSchema = z.object({
  medication: z.string().min(1, "Medication is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.string().min(1, "Frequency is required"),
  conditionPrescribed: z.string().min(1, "Condition prescribed is required"),
});

type MedicationFormData = z.infer<typeof medicationSchema>;

interface PatientMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  medication?: PatientMedication | null;
  onSave: (medication: PatientMedication) => void;
  isLoading?: boolean;
}

export default function PatientMedicationModal({
  isOpen,
  onClose,
  medication,
  onSave,
  isLoading = false,
}: PatientMedicationModalProps) {
  const isEditing = !!medication;

  const form = useForm<MedicationFormData>({
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      medication: "",
      dosage: "",
      frequency: "",
      conditionPrescribed: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (medication) {
        form.reset({
          medication: medication.medication,
          dosage: medication.dosage,
          frequency: medication.frequency,
          conditionPrescribed: medication.conditionPrescribed,
        });
      } else {
        form.reset({
          medication: "",
          dosage: "",
          frequency: "",
          conditionPrescribed: "",
        });
      }
    }
  }, [isOpen, medication, form]);

  const onSubmit = (data: MedicationFormData) => {
    const medicationData: PatientMedication = {
      ...data,
      key: medication?.key,
    };
    onSave(medicationData);
    onClose();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="flex-col border-b border-[#D9D9D9] p-4">
          <DialogTitle className="text-lg font-semibold">
            {isEditing ? "Edit Medication" : "Add Medication"}
          </DialogTitle>
        </DialogHeader>

        <div className="p-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Medication Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="medication"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Medication <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter medication name"
                            className="border-gray-300"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dosage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Dosage <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter dosage"
                            className="border-gray-300"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="frequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Frequency <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter frequency"
                            className="border-gray-300"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="conditionPrescribed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Condition Prescribed{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter condition"
                            className="border-gray-300"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex gap-4 justify-end pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="px-[20px] py-[5px] min-h-[40px] cursor-pointer rounded-[50px] border-primary text-primary font-semibold leading-[16px]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="px-[20px] py-[5px] min-h-[40px] cursor-pointer rounded-[50px] bg-primary text-white font-semibold leading-[16px]"
                >
                  {isLoading
                    ? "Saving..."
                    : isEditing
                    ? "Update Medication"
                    : "Add Medication"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
