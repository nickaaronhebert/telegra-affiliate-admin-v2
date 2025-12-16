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
import type { MedicationAllergy } from "@/types/responses/patient";

const allergySchema = z.object({
  medicationAllergies: z.string().min(1, "Medication is required"),
  reaction: z.string().min(1, "Reaction is required"),
});

type AllergyFormData = z.infer<typeof allergySchema>;

interface PatientAllergyModalProps {
  isOpen: boolean;
  onClose: () => void;
  allergy?: MedicationAllergy | null;
  onSave: (allergy: MedicationAllergy) => void;
  isLoading?: boolean;
}

export function PatientAllergyModal({
  isOpen,
  onClose,
  allergy,
  onSave,
  isLoading = false,
}: PatientAllergyModalProps) {
  const isEditing = !!allergy;

  const form = useForm<AllergyFormData>({
    resolver: zodResolver(allergySchema),
    defaultValues: {
      medicationAllergies: "",
      reaction: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (allergy) {
        form.reset({
          medicationAllergies: allergy.medicationAllergies,
          reaction: allergy.reaction,
        });
      } else {
        form.reset({
          medicationAllergies: "",
          reaction: "",
        });
      }
    }
  }, [isOpen, allergy, form]);

  const onSubmit = (data: AllergyFormData) => {
    const allergyData: MedicationAllergy = {
      ...data,
      key: allergy?.key,
    };
    onSave(allergyData);
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
            {isEditing ? "Edit Allergy" : "Add Allergy"}
          </DialogTitle>
        </DialogHeader>

        <div className="p-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Allergy Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="medicationAllergies"
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
                    name="reaction"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Reaction <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter reaction"
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
                  {isLoading ? "Saving..." : isEditing ? "Update Allergy" : "Add Allergy"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}