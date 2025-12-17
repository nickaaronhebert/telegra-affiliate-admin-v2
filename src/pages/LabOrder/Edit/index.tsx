import { Button } from "@/components/ui/button";
import { labOrderSchema } from "@/schemas/editLabOrderSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useViewPatientByIdQuery } from "@/redux/services/patient";
import SelectElement from "@/components/Form/SelectElement";
import { CenteredRow } from "@/components/ui/centered-row";
import InputElement from "@/components/Form/InputElement";
import {
  useEditLabOrderMutation,
  useViewAllLabPanelsQuery,
} from "@/redux/services/labOrder";
import MultiSelectElement from "@/components/Form/MultiSelectElement";
import { Switch } from "@/components/ui/switch";
import ProductVariations from "@/components/Form/ProductVariations";

import { toast } from "sonner";
import { useViewAllStatesQuery } from "@/redux/services/state";

interface EditLabOrdersProps {
  handleClose: (arg: boolean) => void;
  userId?: string;
  labId: string;
  labName: string;
  labPanels: string[];
  labOrderId: string;
  affiliate: string;
  address: {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipcode: string;
  };
}
export default function EditLabOrders({
  userId,
  labId,
  labName,
  labPanels,
  labOrderId,
  affiliate,
  address,
  handleClose,
}: EditLabOrdersProps) {
  const [editLabOrder, { isLoading }] = useEditLabOrderMutation();
  const { data: addressData } = useViewPatientByIdQuery(userId!, {
    skip: !userId,
    selectFromResult: ({ data }) => ({
      data: {
        address: data?.addresses?.map((address) => {
          const address1 = address?.shipping?.address1 ?? ""; // Empty string if address1 is falsy
          const address2 = address?.shipping?.address2 ?? ""; // Empty string if address2 is falsy
          const city = address?.shipping?.city ?? ""; // Empty string if city is falsy
          const state = address?.shipping?.state?.id ?? ""; // Empty string if state is falsy
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

  const { data: statesData } = useViewAllStatesQuery(undefined, {
    selectFromResult: ({ data }) => ({
      data: data?.map((item) => {
        return {
          label: item?.name,
          value: item?.id,
        };
      }), // Adjust the `map` function if you want to transform `item`
    }),
  });

  const { data } = useViewAllLabPanelsQuery(labId, {
    skip: !labId,
    selectFromResult: ({ data }) => ({
      data: data?.map((item) => {
        return {
          label: item.title,
          value: item.id,
        };
      }),
    }),
  });
  const form = useForm<z.infer<typeof labOrderSchema>>({
    mode: "onTouched",
    resolver: zodResolver(labOrderSchema),
    defaultValues: {
      prefill: "",
      address: {
        address1: address?.address1 || "",
        address2: address?.address2 || undefined,
        city: address?.city || "",
        state: address?.state || "",
        zipcode: address?.zipcode || "",
        country: "United States",
      },
      lab: labName,
      labPanels: labPanels || [],
      afterResultsOrderProductVariations: [],
      createOrderAfterResults: false,
    },
  });

  async function onSubmit(values: z.infer<typeof labOrderSchema>) {
    console.log("Selected Patient:", values);
    const productVariations = values?.afterResultsOrderProductVariations?.map(
      (item) => {
        return {
          productVariation: item.productVariation,
          quantity: Number(item.quantity),
        };
      }
    );
    const payload = {
      patient: userId as string,
      address: {
        billing: values.address,
        shipping: values.address,
      },
      affiliate: affiliate as string,
      lab: labId,
      labPanels: values?.labPanels as string[],
      createOrderAfterResults: values?.createOrderAfterResults,
      afterResultsOrderProductVariations: productVariations,
      labOrderId,
    };
    await editLabOrder(payload)
      .then(() => {
        toast.success(" Lab Order Updated Successfully", {
          duration: 1500,
        });
        handleClose(false);
      })
      .catch((err) => {
        console.log("err", err);
        toast.error("Something went wrong", {
          duration: 1500,
        });
      });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" max-h-150 overflow-y-auto"
      >
        <div>
          <div className="flex gap-4">
            <div className="mt-3.5 w-[45%] space-y-3.5 ">
              <SelectElement
                name="patient"
                options={addressData?.address || []}
                label="User Address"
                className=" min-h-14 w-95 "
                placeholder="Select patient..."
                onChange={(value) => {
                  const [address1, city, state, zipcode, address2] =
                    value?.split("?");

                  console.log("state", state);
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

                  <SelectElement
                    name={`address.state`}
                    options={statesData || []}
                    label="State"
                    isRequired={true}
                    errorClassName="text-right "
                    //   placeholder="1247 Broadway Street"
                    className="min-w-45 border-border placeholder:text-[#C3C1C6]"
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

            <div className="w-[45%] mt-3.5 space-y-3.5 ">
              <InputElement
                name={"lab"}
                className="w-full"
                label="Lab"
                disabled={true}
                isRequired={true}
                messageClassName="text-right "
                //   placeholder="1247 Broadway Street"
                inputClassName="border-border bg-border min-h-14 placeholder:text-[#C3C1C6]"
              />

              <MultiSelectElement
                name="labPanels"
                options={data || []}
                label="Lab Panels"
                messageClassName="text-right"
              />

              <div>
                <FormField
                  control={form.control}
                  name="createOrderAfterResults"
                  render={({ field }) => (
                    <FormItem className=" rounded-lg border p-4">
                      <div className="flex items-start justify-between space-y-0.5">
                        <div>
                          <FormLabel className="text-base">
                            Create Post-Results Order
                          </FormLabel>
                          <FormDescription>
                            If activated, the Admin can choose what product
                            variations will be added to the order that gets
                            created after the results are returned.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <ProductVariations />
            </div>
          </div>
          <div className="flex justify-end mt-10 border-t border-card-border border-dashed pt-10">
            <Button
              type="submit"
              disabled={isLoading}
              // disabled={!form.formState.isValid}
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
