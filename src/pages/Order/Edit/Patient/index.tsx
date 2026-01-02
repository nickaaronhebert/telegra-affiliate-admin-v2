import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SelectElement from "@/components/Form/SelectElement";
import { selectPatientSchema } from "@/schemas/selectPatientSchema";

import { useAppDispatch } from "@/redux/store";
import { updateInitialStep } from "@/redux/slices/create-order";
import type { PatientProps } from "..";
import dayjs from "@/lib/dayjs";

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

export default function EcommercePatientDetails({
  patientId,
  disabled = false,
  patientDetails,
}: {
  patientId: string;
  disabled?: boolean;
  patientDetails: PatientProps;
}) {
  const dispatch = useAppDispatch();
  const data = [
    {
      label: `${patientDetails.name}, ${patientDetails.phone}, ${
        patientDetails.email
      }, ${
        patientDetails.dateOfBirth
          ? formatToMMDDYYYY(patientDetails.dateOfBirth)
          : "-"
      }`,
      value: patientId,
    },
  ];
  const form = useForm<z.infer<typeof selectPatientSchema>>({
    resolver: zodResolver(selectPatientSchema),
    defaultValues: {
      patient: patientId || "",
    },
  });

  async function onSubmit(values: z.infer<typeof selectPatientSchema>) {
    dispatch(updateInitialStep({ patient: values.patient }));
  }

  return (
    <div className="px-40 mb-10">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Select a Patient to Proceed
        </h2>
        <p className="text-sm text-gray-600 mb-4">
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <div>
            <div className="mt-3.5">
              <SelectElement
                disabled={disabled}
                name="patient"
                options={data || []}
                className=" min-h-14 max-w-[500px] min-w-[500px]"
                placeholder="Select patient..."
              />
            </div>

            {patientDetails && (
              <>
                {/* Patient Details */}
                <div className="my-5 min-w-[500px]">
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
                            {patientDetails.name || "-"}
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
                            {patientDetails?.phone}
                          </span>
                        </div>
                        <div className="flex justify-between items-center ">
                          <span className="text-sm text-gray-600 font-medium">
                            Gender
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {patientDetails?.genderBiological}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 font-medium">
                            DOB
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {patientDetails?.dateOfBirth
                              ? dayjs(patientDetails?.dateOfBirth)?.format(
                                  "MMMM D, YYYY"
                                )
                              : "-"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Add Patient Diagnostics */}
                {/* <div>
                  <h3 className="font-semibold text-gray-900 my-5">
                    Diagnostics
                  </h3>



                  {patientDetails?.currentMedication.length > 0 && (
                    <div className="flex justify-between">
                      <p className="text-sm font-normal text-[#63627F]">
                        Medication Allergies
                      </p>
                      <div className="max-h-32 overflow-y-auto   rounded-lg">
                        <div className="flex justify-end flex-wrap gap-2 max-w-[320px]">
                          {patientDetails?.currentMedication?.map(
                            (allergy, index) => (
                              <span
                                key={`${allergy}${index}`}
                                className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-lg font-medium shadow-sm "
                              >
                                {allergy}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div> */}
              </>
            )}

            <div className="flex justify-end mt-10 border-t border-card-border border-dashed pt-10">
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
