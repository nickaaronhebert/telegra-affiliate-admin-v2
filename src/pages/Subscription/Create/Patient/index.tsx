import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { selectPatientSchema } from "@/schemas/selectPatientSchema";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PatientSearch } from "@/components/Form/SelectPatientElement/patientSearch";
import { useAppDispatch, useTypedSelector } from "@/redux/store";
import { nextStep, updatePatientDetails } from "@/redux/slices/subscription";
import type { Patient } from "@/types/responses/patient";

export function formatToMMDDYYYY(dateStr: string): string {
  const date = new Date(dateStr);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }

  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = date.getFullYear();

  return `${mm}/${dd}/${yyyy}`;
}

export default function Patient() {
  const patientDetails = useTypedSelector(
    (state) => state.subscription.patient
  );
  const patientId = `${patientDetails.firstName}/${patientDetails.lastName}/${patientDetails.phoneNumber}/${patientDetails.email}/${patientDetails.patient}`;
  const dispatch = useAppDispatch();
  const form = useForm<z.infer<typeof selectPatientSchema>>({
    resolver: zodResolver(selectPatientSchema),
    defaultValues: {
      patient: patientDetails?.patient ? patientId : "",
    },
  });

  async function onSubmit(values: z.infer<typeof selectPatientSchema>) {
    dispatch(nextStep());
    // dispatch(updateInitialStep({ patient: values.patient }));
  }

  return (
    <div className="mb-10 ">
      <div className="px-30">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Select a Patient to Proceed
        </h2>
        <p className="text-sm text-gray-600 ">
          If patient is not listed,{" "}
          <Link
            to={"/patients"}
            className="text-[#008CE3]  cursor-pointer underline underline-offset-2"
          >
            Create Patient
          </Link>
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div>
            <div className="mt-3.5 px-30">
              <FormField
                control={form.control}
                name="patient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="patient">
                      Patient <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <PatientSearch
                        selectedPatient={field.value}
                        onSelect={(patient: Patient | null) => {
                          if (!patient) field.onChange(null);

                          if (patient) {
                            field.onChange(
                              `${patient.firstName}/${patient.lastName}/${patient.phone}/${patient.email}/${patient.id}`
                            );
                            // const [firstName,lastName,phone,email,_id] = patient.split("/")
                            dispatch(
                              updatePatientDetails({
                                patient: patient.id,
                                firstName: patient.firstName,
                                lastName: patient.lastName,
                                gender: patient.genderBiological,
                                dob: patient.dateOfBirth
                                  ? formatToMMDDYYYY(patient.dateOfBirth)
                                  : "-",
                                email: patient.email,
                                currentMedications: patient.patientMedications,
                                medicationAllergies:
                                  patient.medicationAllergies,
                                phoneNumber: patient.phone || "-",
                              })
                            );
                          }
                        }}
                      />
                    </FormControl>

                    <FormMessage className="text-right" />
                  </FormItem>
                )}
              />
            </div>

            {patientDetails && patientDetails?.patient && (
              <div className="my-5 px-30">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Patient Details
                </h3>
                <Card className="w-full bg-slate-100">
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-1">
                      <div className="flex justify-between items-center  ">
                        <span className="text-sm text-gray-600 font-medium">
                          Full Name
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {patientDetails?.firstName} {patientDetails?.lastName}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 font-medium">
                          Email
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {patientDetails?.email}
                        </span>
                      </div>
                      <div className="flex justify-between items-center  ">
                        <span className="text-sm text-gray-600 font-medium">
                          Phone Number
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {patientDetails?.phoneNumber}
                        </span>
                      </div>
                      <div className="flex justify-between items-center ">
                        <span className="text-sm text-gray-600 font-medium">
                          Gender
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {patientDetails?.gender}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 font-medium">
                          DOB
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {patientDetails?.dob}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="flex justify-end mt-5 border-t border-card-border border-dashed pt-10">
              {/* <Button
                type="button"
                variant={"outline"}
                onClick={() => dispatch(prevStep())}
                className="rounded-full min-h-12 min-w-[130px] text-[14px] font-semibold cursor-pointer"
              >
                Back
              </Button> */}

              <Button
                type="submit"
                disabled={!form.formState.isValid}
                className="rounded-full min-h-12 min-w-[130px] text-[14px] font-semibold text-white cursor-pointer"
              >
                Next
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
