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
import { toast } from "sonner";
import { useViewPatientByIdQuery } from "@/redux/services/patient";
import { prevStep, resetSubscription } from "@/redux/slices/subscription";
import type { ADDRESS } from "@/redux/slices/create-order";
import { useCreateSubscriptionMutation } from "@/redux/services/subscription";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useViewAllStatesQuery } from "@/redux/services/state";
import SelectElement from "@/components/Form/SelectElement";

interface handleSubscriptionProps {
  address?: string;
  billingAddress?: ADDRESS;
  shippingAddress?: ADDRESS;
}

export default function SubscriptionAddress() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [createSubscription, { isLoading }] = useCreateSubscriptionMutation();
  const subscriptionDetails = useTypedSelector((state) => state.subscription);

  const [selectedAddress, setSelectedAddress] = useState<string>(
    subscriptionDetails?.sub_address?.address || ""
  );
  const [billingAddress, setBillingAddress] = useState(
    !subscriptionDetails?.selectedAddress?.newBillingAddress
  );
  const { data, isLoading: isPatientDetailsLoading } = useViewPatientByIdQuery(
    subscriptionDetails?.patient?.patient as string,
    {
      skip: !subscriptionDetails?.patient?.patient,
      selectFromResult: ({ data, isLoading }) => ({
        data: {
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
    }
  );

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
      newShippingAddress:
        subscriptionDetails?.selectedAddress?.newShippingAddress,
      newBillingAddress:
        subscriptionDetails?.selectedAddress?.newBillingAddress,
      shippingAddress: subscriptionDetails?.selectedAddress?.shippingAddress,
      billingAddress: subscriptionDetails?.selectedAddress?.billingAddress,
    },
  });

  async function handleCreateSubscription(payload: handleSubscriptionProps) {
    const productVariations =
      subscriptionDetails?.product?.productVariations?.map((item) => {
        const [id, _quantity, _productName] = item.productVariation.split("?");
        return {
          variationId: id,
          quantity: item.quantity,
          pricePerUnitOverride: item.pricePerUnitOverride,
        };
      });

    await createSubscription({
      order: subscriptionDetails?.product?.order,
      patient: subscriptionDetails?.patient?.patient as string,
      schedule: subscriptionDetails?.product?.schedule,
      productVariations,
      ...payload,
    })
      .unwrap()
      .then(() => {
        toast.success("Subscription Created Successfully", {
          duration: 1500,
        });
        dispatch(resetSubscription());
        navigate("/subscriptions");
      })
      .catch((err) => {
        console.log("error", err);
        toast.error("Something went wrong", {
          duration: 1500,
        });
      });
  }

  async function onSubmit(values: z.infer<typeof selectOrderAddressSchema>) {
    if (selectedAddress) {
      await handleCreateSubscription({ address: selectedAddress });
    } else {
      if (values.shippingAddress) {
        if (!values.newBillingAddress) {
          await handleCreateSubscription({
            billingAddress: values?.shippingAddress as ADDRESS,
            shippingAddress: values?.shippingAddress as ADDRESS,
          });
        } else {
          if (values.billingAddress) {
            await handleCreateSubscription({
              billingAddress: values?.billingAddress as ADDRESS,
              shippingAddress: values?.shippingAddress as ADDRESS,
            });
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
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <div className="max-w-[500px] mx-auto">
            <p className="font-semibold text-xl">Address</p>
            <div className="my-3">
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold my-1">
                  Shipping Address <span className="text-red-500">*</span>
                </p>

                <div className="flex justify-end my-2">
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
              </div>

              {isPatientDetailsLoading ? (
                <div className="min-h-50 flex items-center justify-center">
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
              <div className="mt-4">
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
              </div>
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
                <div>
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
                      className="w-60"
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
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between mt-10 border-t border-card-border border-dashed pt-10">
            <Button
              type="button"
              variant={"outline"}
              onClick={() => dispatch(prevStep())}
              className="rounded-full min-h-12 min-w-[130px] text-[14px] font-semibold cursor-pointer"
            >
              Back
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-full min-h-12 min-w-[130px] text-[14px] font-semibold text-white cursor-pointer"
            >
              {isLoading ? <Spinner /> : <span>Create Subscription</span>}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
