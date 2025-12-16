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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PatientDetail } from "@/types/responses/patient";
import { useUpdatePatientMutation } from "@/redux/services/patient";
import { toast } from "sonner";

const GENDER_OPTIONS = {
  MALE: { label: "Male", value: "male" as const },
  FEMALE: { label: "Female", value: "female" as const },
};

const editPatientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  genderBiological: z.enum(["male", "female"], {
    message: "Please select biological gender",
  }),
  gender: z.enum(["male", "female"]).optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  height: z.number().positive("Height must be positive").optional(),
  weight: z.number().positive("Weight must be positive").optional(),
});

type EditPatientFormData = z.infer<typeof editPatientSchema>;

interface EditPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientDetail;
}

export function EditPatientModal({
  isOpen,
  onClose,
  patient,
}: EditPatientModalProps) {
  const [updatePatient, { isLoading }] = useUpdatePatientMutation();

  const form = useForm<EditPatientFormData>({
    resolver: zodResolver(editPatientSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      genderBiological: GENDER_OPTIONS.MALE.value,
      gender: GENDER_OPTIONS.MALE.value,
      email: "",
      phone: "",
      height: undefined,
      weight: undefined,
    },
  });

  useEffect(() => {
    if (isOpen && patient) {
      form.reset({
        firstName: patient.firstName || "",
        lastName: patient.lastName || "",
        dateOfBirth: patient.dateOfBirth
          ? new Date(patient.dateOfBirth).toISOString().split("T")[0]
          : "",
        genderBiological: (patient.genderBiological as "male" | "female") || GENDER_OPTIONS.MALE.value,
        gender: (patient.gender as "male" | "female") || GENDER_OPTIONS.MALE.value,
        email: patient.email || "",
        phone: patient.phone || "",
        height: patient.height ? Number(patient.height) : undefined,
        weight: patient.weight ? Number(patient.weight) : undefined,
      });
    }
  }, [isOpen, patient, form]);

  const onSubmit = async (data: EditPatientFormData) => {
    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: new Date(data.dateOfBirth).toISOString(),
        genderBiological: data.genderBiological,
        gender: data.gender,
        email: data.email,
        phone: data.phone,
        height: data.height?.toString() || "",
        weight: data.weight?.toString() || "",
      };

      await updatePatient({
        id: patient.id,
        data: payload,
      }).unwrap();
      toast.success("Patient updated successfully!");
      handleClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update patient");
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex-col border-b border-[#D9D9D9] p-4">
          <DialogTitle className="text-lg font-semibold">
            Edit User Details
          </DialogTitle>
        </DialogHeader>

        <div className="p-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-4">
                    {/* Row 1: First Name, Last Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                              First Name <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="border-gray-300"
                                placeholder="Jaden"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Last Name <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="border-gray-300"
                                placeholder="Walter"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Row 2: Date of Birth, Biological Gender */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Date of Birth{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                max={new Date().toISOString().split("T")[0]}
                                className="border-gray-300"
                                placeholder="11/7/1990"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="genderBiological"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Biological Gender{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="border-gray-300">
                                  <SelectValue placeholder="Select biological gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value={GENDER_OPTIONS.MALE.value}>
                                  {GENDER_OPTIONS.MALE.label}
                                </SelectItem>
                                <SelectItem value={GENDER_OPTIONS.FEMALE.value}>
                                  {GENDER_OPTIONS.FEMALE.label}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Row 3: Identified Gender, Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Identified Gender
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="border-gray-300">
                                  <SelectValue placeholder="Select identified gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value={GENDER_OPTIONS.MALE.value}>
                                  {GENDER_OPTIONS.MALE.label}
                                </SelectItem>
                                <SelectItem value={GENDER_OPTIONS.FEMALE.value}>
                                  {GENDER_OPTIONS.FEMALE.label}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Email Address{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                className="border-gray-300"
                                placeholder="jaden@email.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Row 4: Phone, Height & Weight */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Phone Number{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="border-gray-300"
                                placeholder="(555)-123-4567"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="height"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Height (in.)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="60"
                                  className="border-gray-300"
                                  {...field}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    field.onChange(
                                      value ? Number(value) : undefined
                                    );
                                  }}
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="weight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Weight (lb.)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="500"
                                  className="border-gray-300"
                                  {...field}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    field.onChange(
                                      value ? Number(value) : undefined
                                    );
                                  }}
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
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
                  {isLoading ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
