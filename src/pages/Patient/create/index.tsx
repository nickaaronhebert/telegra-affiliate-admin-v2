import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createPatientSchema,
  type CreatePatientFormData,
} from "@/schemas/createPatientSchema";
import { useCreatePatientMutation } from "@/redux/services/patient";
import { Plus } from "lucide-react";
import { GENDER_OPTIONS } from "@/constants";

interface CreatePatientProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreatePatient({ open, onOpenChange }: CreatePatientProps) {
  const [createPatient, { isLoading }] = useCreatePatientMutation();

  const form = useForm<CreatePatientFormData>({
    resolver: zodResolver(createPatientSchema),
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

  const onSubmit = async (data: CreatePatientFormData) => {
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

      await createPatient(payload).unwrap();
      toast.success("Patient created successfully!");
      form.reset();
      onOpenChange?.(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create patient");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="px-[20px] py-[5px] min-h-[40px] cursor-pointer rounded-[50px] bg-primary text-white font-semibold leading-[16px]">
          <Plus /> Add Patient
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex-col border-b border-[#D9D9D9] p-4">
          <DialogTitle className="text-lg font-semibold">
            Add Patient
          </DialogTitle>
        </DialogHeader>

        <div className="p-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Patient Details</h3>

                  <div className="space-y-4">
                    {/* Row 1: First Name, Last Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold text-[var(--card-foreground)]">
                              First Name{" "}
                              <span className="text-[var(--destructive)]">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="w-full"
                                placeholder="Eg. John"
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
                            <FormLabel className="font-semibold text-[var(--card-foreground)]">
                              Last Name{" "}
                              <span className="text-[var(--destructive)]">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="w-full"
                                placeholder="Eg. Smith"
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
                            <FormLabel className="font-semibold text-[var(--card-foreground)]">
                              Date of Birth{" "}
                              <span className="text-[var(--destructive)]">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                max={new Date().toISOString().split("T")[0]}
                                className="w-full"
                                placeholder="MM/DD/YYY"
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
                            <FormLabel className="font-semibold text-[var(--card-foreground)]">
                              Biological Gender{" "}
                              <span className="text-[var(--destructive)]">*</span>
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Biological Gender" />
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
                            <FormLabel className="font-semibold text-[var(--card-foreground)]">
                              Identified Gender{" "}
                              <span className="text-[var(--destructive)]">*</span>
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Identified Gender" />
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
                            <FormLabel className="font-semibold text-[var(--card-foreground)]">
                              Email Address{" "}
                              <span className="text-[var(--destructive)]">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                className="w-full"
                                placeholder="email@address.com"
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
                            <FormLabel className="font-semibold text-[var(--card-foreground)]">
                              Phone Number{" "}
                              <span className="text-[var(--destructive)]">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                className="w-full"
                                placeholder="(123) 456-7890"
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
                              <FormLabel className="font-semibold">
                                Height(in.)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="w-full"
                                  type="number"
                                  placeholder="Inches"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value
                                        ? parseFloat(e.target.value)
                                        : undefined
                                    )
                                  }
                                  min="20"
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
                              <FormLabel className="font-semibold">
                                Weight (lb.)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="w-full"
                                  type="number"
                                  placeholder="Pounds"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value
                                        ? parseFloat(e.target.value)
                                        : undefined
                                    )
                                  }
                                  min="40"
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
                  onClick={() => {
                    form.reset();
                    onOpenChange?.(false);
                  }}
                  className="px-[20px] py-[5px] min-h-[40px] cursor-pointer rounded-[50px] border-primary text-primary font-semibold leading-[16px]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="px-[20px] py-[5px] min-h-[40px] cursor-pointer rounded-[50px] bg-primary text-white font-semibold leading-[16px]"
                >
                  {isLoading ? "Creating..." : "Create Patient"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
