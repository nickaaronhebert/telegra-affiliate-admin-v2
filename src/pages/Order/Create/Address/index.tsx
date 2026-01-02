//  import { useViewPatientDetailsQuery } from "@/redux/services/patient";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { selectOrderAddressSchema } from "@/schemas/selectOrderAddress";
import { Form } from "@/components/ui/form";
import InputElement from "@/components/Form/InputElement";
import { CenteredRow } from "@/components/ui/centered-row";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppDispatch, useTypedSelector } from "@/redux/store";
import { Button } from "@/components/ui/button";
import {
  prevStep,
  updateOrderAddress,
  updateStepTwo,
  type ADDRESS,
} from "@/redux/slices/create-order";
import { toast } from "sonner";
import { useViewPatientByIdQuery } from "@/redux/services/patient";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useViewAllStatesQuery } from "@/redux/services/state";
import SelectElement from "@/components/Form/SelectElement";

interface SelectAddressProps {
  userId: string;

  // address: SELECT_ADDRESS;
}

export default function SelectAddress({ userId }: SelectAddressProps) {
  const dispatch = useAppDispatch();
  const order = useTypedSelector((state) => state.order);
  const [selectedAddress, setSelectedAddress] = useState<string>(
    order?.stepTwo?.address || ""
  );
  const [billingAddress, setBillingAddress] = useState(
    !order?.selectedAddress?.newBillingAddress
  );
  const { data, isLoading } = useViewPatientByIdQuery(userId, {
    skip: !userId,
    selectFromResult: ({ data, isLoading }) => ({
      data: {
        // defaultAddress: data?.addresses?.filter((address) => {
        //   return address.defaultAddress === true;
        // }),
        address: data?.addresses?.map((address) => {
          return {
            id: address?.id,
            address1: address?.shipping?.address1,
            address2: address?.shipping?.address2,
            city: address?.shipping?.city,
            state: address?.shipping?.state?.name,
            zipcode: address?.shipping?.zipcode,
          };
        }),
      },

      isLoading,
    }),
  });

  const { data: statesData } = useViewAllStatesQuery(undefined, {
    selectFromResult: ({ data, isLoading }) => ({
      data: data?.map((item) => {
        return {
          label: item?.name,
          value: item?.id,
        };
      }), // Adjust the `map` function if you want to transform `item`
      isLoading,
    }),
  });

  const form = useForm<z.infer<typeof selectOrderAddressSchema>>({
    mode: "onTouched",
    resolver: zodResolver(selectOrderAddressSchema),
    defaultValues: {
      newShippingAddress: order?.selectedAddress?.newShippingAddress,
      newBillingAddress: order?.selectedAddress?.newBillingAddress,
      shippingAddress: order?.selectedAddress?.shippingAddress,
      billingAddress: order?.selectedAddress?.billingAddress,
    },
  });

  async function onSubmit(values: z.infer<typeof selectOrderAddressSchema>) {
    if (selectedAddress) {
      dispatch(
        updateStepTwo({
          address: selectedAddress,
        })
      );

      dispatch(
        updateOrderAddress({
          billingAddress: undefined,
          shippingAddress: undefined,
          newBillingAddress: false,
          newShippingAddress: false,
        })
      );
    } else {
      dispatch(
        updateStepTwo({
          address: "",
        })
      );
      if (values.shippingAddress) {
        if (!values.newBillingAddress) {
          dispatch(
            updateOrderAddress({
              billingAddress: values.shippingAddress as ADDRESS,
              shippingAddress: values.shippingAddress as ADDRESS,
              newShippingAddress: true,
              newBillingAddress: false,
            })
          );
        } else {
          if (values.billingAddress) {
            dispatch(
              updateOrderAddress({
                billingAddress: values.billingAddress as ADDRESS,
                shippingAddress: values.shippingAddress as ADDRESS,
                newBillingAddress: true,
                newShippingAddress: true,
              })
            );
          } else {
            toast.error("Select Billing Address", {
              duration: 1500,
            });
          }
        }
      } else {
        toast.error("Select Shipping Address", {
          duration: 1500,
        });
      }
    }
  }

  const newShippingAddress = form.watch("newShippingAddress");
  const newBillingAddress = form.watch("newBillingAddress");

  return (
    <div className="">
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <div className="max-w-125 mx-auto">
              <p className="font-semibold text-xl">Address</p>
              <div className="my-3">
                <div className="flex justify-between">
                  <p className="text-sm font-semibold my-1">
                    Shipping Address <span className="text-red-500">*</span>
                  </p>

                  <span
                    className="text-xs font-normal text-[#008CE3] cursor-pointer"
                    onClick={() => {
                      if (newShippingAddress) return;

                      setSelectedAddress("");
                      form.setValue("newShippingAddress", true);
                      form.setValue("shippingAddress", {
                        address1: "",
                        address2: "",
                        city: "",
                        state: "",
                        zipcode: "",
                        country: "",
                      });
                    }}
                  >
                    +{" "}
                    <span className="underline underline-offset-1">
                      Add Another Shipping Address
                    </span>
                  </span>
                </div>

                {isLoading ? (
                  <div className="min-h-32 flex items-center justify-center">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <RadioGroup
                    value={selectedAddress}
                    onValueChange={(value: string) => {
                      form.setValue("newShippingAddress", false);
                      form.setValue("shippingAddress", undefined);

                      setSelectedAddress(value);
                    }}
                  >
                    {data?.address?.map((address, index) => {
                      return (
                        <div
                          key={address.id}
                          className={cn(
                            "flex py-4 px-5 justify-between w-full border  rounded-2xl",
                            selectedAddress === address.id
                              ? "border-[#008CE3] bg-[#E5F3FC]"
                              : "border-[#DFDFDFE0]"
                          )}
                        >
                          <div className="space-y-3">
                            <Label
                              className="text-[#042769]"
                              htmlFor={address.id}
                            >{`Address - ${index + 1}`}</Label>
                            <p className="text-xs font-normal">
                              {`${address.address1}, ${
                                address.address2 ? address.address2 + "," : ""
                              } ${address.city}, ${address.state} - ${
                                address.zipcode
                              }`}
                            </p>
                          </div>
                          <RadioGroupItem value={address.id} id={address.id} />
                        </div>
                      );
                    })}
                  </RadioGroup>
                )}
              </div>

              {newShippingAddress && (
                <>
                  <CenteredRow>
                    <InputElement
                      name={`shippingAddress.address1`}
                      className="w-60 "
                      label="Address Line 1"
                      isRequired={true}
                      messageClassName="text-right"
                      placeholder="1247 Broadway Street"
                      inputClassName="border-border !h-[46px] placeholder:text-[#C3C1C6]"
                      reserveSpace={true}
                    />

                    <InputElement
                      name={`shippingAddress.address2`}
                      className="w-60 "
                      label="Address Line 2"
                      isRequired={true}
                      messageClassName="text-right"
                      placeholder="1247 Broadway Street"
                      inputClassName="border-border !h-[46px] placeholder:text-[#C3C1C6]"
                      reserveSpace={true}
                    />
                  </CenteredRow>

                  <CenteredRow>
                    <InputElement
                      name={`shippingAddress.city`}
                      className="w-60 "
                      label="City"
                      isRequired={true}
                      messageClassName="text-right"
                      placeholder="1247 Broadway Street"
                      reserveSpace={true}
                      inputClassName="border-border !h-[46px] placeholder:text-[#C3C1C6]"
                    />

                    {/* <InputElement
                      name={`shippingAddress.state`}
                      className="w-60 "
                      label="State"
                      isRequired={true}
                      messageClassName="text-right"
                      placeholder="1247 Broadway Street"
                      reserveSpace={true}
                      inputClassName="border-border !h-[46px] placeholder:text-[#C3C1C6]"
                    /> */}
                    <SelectElement
                      options={statesData || []}
                      name={`shippingAddress.state`}
                      className="w-60 "
                      label="State"
                      isRequired={true}
                      errorClassName="text-right"
                      placeholder="Select State"
                      reserveSpace={true}
                      triggerClassName="border border-border"
                      labelClassName="!placeholder:text-muted-foreground"
                      // className="border-border !h-[46px] placeholder:text-[#C3C1C6]"
                    />
                  </CenteredRow>

                  <CenteredRow>
                    <InputElement
                      name={`shippingAddress.zipcode`}
                      className="w-60 "
                      label="Zipcode"
                      isRequired={true}
                      messageClassName="text-right"
                      placeholder="1247 Broadway Street"
                      reserveSpace={true}
                      inputClassName="border-border !h-[46px] placeholder:text-[#C3C1C6]"
                    />

                    <InputElement
                      name={`shippingAddress.country`}
                      className="w-60 "
                      label="Country"
                      isRequired={true}
                      messageClassName="text-right"
                      placeholder="1247 Broadway Street"
                      reserveSpace={true}
                      inputClassName="border-border !h-[46px] placeholder:text-[#C3C1C6]"
                    />
                  </CenteredRow>
                </>
              )}

              <div>
                <div className="my-3">
                  <p className="text-sm font-semibold my-1">
                    Billing Address <span className="text-red-500">*</span>
                  </p>
                </div>

                <div className="flex items-center gap-3 my-4">
                  <Checkbox
                    id="billing_address"
                    checked={billingAddress}
                    onCheckedChange={(checked) => {
                      console.log("checked", checked);
                      if (!checked) {
                        form.setValue("billingAddress", {
                          address1: "",
                          address2: "",
                          city: "",
                          state: "",
                          zipcode: "",
                          country: "",
                        });
                        form.setValue("newBillingAddress", true);
                        setSelectedAddress("");
                      } else {
                        form.setValue("billingAddress", undefined);
                        form.setValue("newBillingAddress", false);
                      }
                      setBillingAddress(checked as boolean);
                    }}
                  />
                  <Label htmlFor="billing_address">
                    Same as Shipping address
                  </Label>
                </div>

                {newBillingAddress && (
                  <>
                    <CenteredRow>
                      <InputElement
                        name={`billingAddress.address1`}
                        className="w-60 "
                        label="Address Line 1"
                        isRequired={true}
                        messageClassName="text-right"
                        placeholder="1247 Broadway Street"
                        inputClassName="border-border !h-[46px] placeholder:text-[#C3C1C6]"
                        reserveSpace={true}
                      />

                      <InputElement
                        name={`billingAddress.address2`}
                        className="w-60 "
                        label="Address Line 2"
                        isRequired={true}
                        messageClassName="text-right"
                        placeholder="1247 Broadway Street"
                        inputClassName="border-border !h-[46px] placeholder:text-[#C3C1C6]"
                        reserveSpace={true}
                      />
                    </CenteredRow>

                    <CenteredRow>
                      <InputElement
                        name={`billingAddress.city`}
                        className="w-60 "
                        label="City"
                        isRequired={true}
                        messageClassName="text-right"
                        placeholder="1247 Broadway Street"
                        reserveSpace={true}
                        inputClassName="border-border !h-[46px] placeholder:text-[#C3C1C6]"
                      />

                      {/* <InputElement
                        name={`billingAddress.state`}
                        className="w-60 "
                        label="State"
                        isRequired={true}
                        messageClassName="text-right"
                        placeholder="1247 Broadway Street"
                        reserveSpace={true}
                        inputClassName="border-border !h-[46px] placeholder:text-[#C3C1C6]"
                      /> */}
                      <SelectElement
                        options={statesData || []}
                        name={`billingAddress.state`}
                        className="w-60 "
                        label="State"
                        isRequired={true}
                        errorClassName="text-right"
                        placeholder="Select State"
                        reserveSpace={true}
                        triggerClassName="border border-border"
                        labelClassName="!placeholder:text-muted-foreground"
                        // className="border-border !h-[46px] placeholder:text-[#C3C1C6]"
                      />
                    </CenteredRow>

                    <CenteredRow>
                      <InputElement
                        name={`billingAddress.zipcode`}
                        className="w-60 "
                        label="Zipcode"
                        isRequired={true}
                        messageClassName="text-right"
                        placeholder="1247 Broadway Street"
                        reserveSpace={true}
                        inputClassName="border-border !h-[46px] placeholder:text-[#C3C1C6]"
                      />

                      <InputElement
                        name={`billingAddress.country`}
                        className="w-60 "
                        label="Country"
                        isRequired={true}
                        messageClassName="text-right"
                        placeholder="1247 Broadway Street"
                        reserveSpace={true}
                        inputClassName="border-border !h-[46px] placeholder:text-[#C3C1C6]"
                      />
                    </CenteredRow>
                  </>
                )}
              </div>
            </div>
            <div className="flex justify-between mt-10 border-t border-card-border border-dashed pt-10">
              <Button
                type="button"
                variant={"outline"}
                onClick={() => dispatch(prevStep())}
                className="rounded-full min-h-12 min-w-32.5 text-[14px] font-semibold cursor-pointer"
              >
                Back
              </Button>

              <Button
                type="submit"
                disabled={isLoading}
                // disabled={!form.formState.isValid}
                className="rounded-full min-h-12 min-w-32.5 text-[14px] font-semibold text-white cursor-pointer"
              >
                Next
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
