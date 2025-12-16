import { Button } from "@/components/ui/button";
import { labOrderSchema } from "@/schemas/editLabOrderSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type z from "zod";
import { Form } from "@/components/ui/form";
import { useViewPatientByIdQuery } from "@/redux/services/patient";
import SelectElement from "@/components/Form/SelectElement";
import { CenteredRow } from "@/components/ui/centered-row";
import InputElement from "@/components/Form/InputElement";

interface EditLabOrdersProps {
  userId?: string;
  labId: string;
  labName: string;
}
export default function EditLabOrders({
  userId,
  // labId,
  labName,
}: EditLabOrdersProps) {
  const { data: addressData } = useViewPatientByIdQuery(userId!, {
    skip: !userId,
    selectFromResult: ({ data }) => ({
      data: {
        address: data?.addresses?.map((address) => {
          const address1 = address?.shipping?.address1 ?? ""; // Empty string if address1 is falsy
          const address2 = address?.shipping?.address2 ?? ""; // Empty string if address2 is falsy
          const city = address?.shipping?.city ?? ""; // Empty string if city is falsy
          const state = address?.shipping?.state?.name ?? ""; // Empty string if state is falsy
          const zipcode = address?.shipping?.zipcode ?? ""; // Empty string if zipcode is falsy

          // Create the id by concatenating non-empty values, delimited by '?'
          const value = [address1, city, state, zipcode, address2]
            .filter(Boolean) // Remove any falsy values ("" will be removed)
            .join("?"); // Join them with the delimiter " ? "

          const label = [address1, city, state, zipcode, address2]
            .filter(Boolean)
            .join(" ,");
          return {
            label,
            value, // You can use the same id for the label or modify as needed
          };
        }),
      },
    }),
  });
  const form = useForm<z.infer<typeof labOrderSchema>>({
    mode: "onTouched",
    resolver: zodResolver(labOrderSchema),
    defaultValues: {
      prefill: "",
      address: {
        address1: "",
        address2: undefined,
        city: "",
        state: "",
        zipcode: "",
        country: "United States",
      },
      lab: labName,
      labPanels: [],
      afterResultsOrderProductVariations: [],
    },
  });

  async function onSubmit(values: z.infer<typeof labOrderSchema>) {
    console.log("Selected Patient:", values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <div>
          <div className="flex gap-4">
            <div className="mt-3.5 w-[45%] space-y-3.5 ">
              <SelectElement
                name="patient"
                options={addressData?.address || []}
                className=" min-h-14 w-95 "
                placeholder="Select patient..."
                onChange={(value) => {
                  const [address1, city, state, zipcode, address2] =
                    value?.split("?");
                  if (address1) {
                    form.setValue("address.address1", address1);
                  }
                  if (address2) {
                    form.setValue("address.address2", address2);
                  }
                  if (city) {
                    form.setValue("address.city", city);
                  }
                  if (state) {
                    form.setValue("address.state", state);
                  }
                  if (zipcode) {
                    form.setValue("address.zipcode", zipcode);
                  }
                }}
              />
              <div className="pt-4 space-y-1.5 border-t border-card-border">
                <CenteredRow>
                  <InputElement
                    name={`address.address1`}
                    className="w-1/2"
                    label="Address Line 1"
                    isRequired={true}
                    messageClassName="text-right"
                    //   placeholder="1247 Broadway Street"
                    inputClassName="border-border min-h-[46px] placeholder:text-[#C3C1C6]"
                    reserveSpace={true}
                  />

                  <InputElement
                    name={`address.address2`}
                    className="w-1/2 "
                    label="Address Line 2"
                    isRequired={true}
                    messageClassName="text-right"
                    //   placeholder="1247 Broadway Street"
                    inputClassName="border-border min-h-[46px] placeholder:text-[#C3C1C6]"
                    reserveSpace={true}
                  />
                </CenteredRow>
                <CenteredRow>
                  <InputElement
                    name={`address.city`}
                    className="w-1/2"
                    label="City"
                    isRequired={true}
                    messageClassName="text-right"
                    //   placeholder="1247 Broadway Street"
                    inputClassName="border-border !h-[46px] placeholder:text-[#C3C1C6]"
                    reserveSpace={true}
                  />

                  <InputElement
                    name={`address.state`}
                    className="w-1/2 "
                    label="State"
                    isRequired={true}
                    messageClassName="text-right "
                    //   placeholder="1247 Broadway Street"
                    inputClassName="border-border !h-[46px] placeholder:text-[#C3C1C6]"
                    reserveSpace={true}
                  />
                </CenteredRow>
                <CenteredRow>
                  <InputElement
                    name={`address.zipcode`}
                    className="w-1/2"
                    label="Zip Code"
                    isRequired={true}
                    messageClassName="text-right"
                    //   placeholder="1247 Broadway Street"
                    inputClassName="border-border !h-[46px] placeholder:text-[#C3C1C6]"
                    reserveSpace={true}
                  />

                  <InputElement
                    name={`address.country`}
                    className="w-1/2 "
                    label="Country"
                    disabled={true}
                    isRequired={true}
                    messageClassName="text-right "
                    //   placeholder="1247 Broadway Street"
                    inputClassName="border-border bg-border !h-[46px] placeholder:text-[#C3C1C6]"
                    reserveSpace={true}
                  />
                </CenteredRow>
              </div>
            </div>
            <div className="w-[45%] ">
              <InputElement
                name={"lab"}
                className="w-full"
                label="Lab"
                disabled={true}
                isRequired={true}
                messageClassName="text-right "
                //   placeholder="1247 Broadway Street"
                inputClassName="border-border bg-border !h-[46px] placeholder:text-[#C3C1C6]"
              />
            </div>
          </div>
          <div className="flex justify-end mt-10 border-t border-card-border border-dashed pt-10">
            <Button
              type="submit"
              disabled={!form.formState.isValid}
              className="rounded-full min-h-12 min-w-32.5 text-[14px] font-semibold text-white cursor-pointer"
            >
              Next
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
