import { useAppDispatch, useTypedSelector } from "@/redux/store";
import { selectOrderPaymentSchema } from "@/schemas/selectOrderPayment";
import { Spinner } from "@/components/ui/spinner";
import { CreditCard } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type z from "zod";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
// import { loadStripe } from "@stripe/stripe-js";
import { useCreateOrderMutation } from "@/redux/services/order";
import { toast } from "sonner";
import {
  prevStep,
  resetOrder,
  updateOrderAmount,
} from "@/redux/slices/create-order";
// import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { useValidateCouponMutation } from "@/redux/services/coupon";
import { useNavigate } from "react-router-dom";
import { ConfirmDialog } from "@/components/common/Dialog";
import AddStripeCard from "@/components/AddPaymentCard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useViewPatientPaymentCardsQuery } from "@/redux/services/paymentMethod";

// const stripePromise = loadStripe(
//   import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string
// );

export default function SelectPaymentDetails() {
  const [addCardModal, setAddCardModal] = useState(false);
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [validateCoupon] = useValidateCouponMutation();
  const navigate = useNavigate();
  const couponRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const order = useTypedSelector((state) => state.order);
  // const userJson = localStorage.getItem("user");
  // const user = userJson ? JSON.parse(userJson) : null;
  const { data, isLoading: isPatiendCardLoading } =
    useViewPatientPaymentCardsQuery({
      patient: order.initialStep.patient as string,
      // affiliate: user?.affiliate,
    });

  const totalAmount = order?.stepOne?.productVariations
    ?.reduce((acc, cVal) => acc + cVal.pricePerUnitOverride * cVal.quantity, 0)
    ?.toString();

  const form = useForm<z.infer<typeof selectOrderPaymentSchema>>({
    resolver: zodResolver(selectOrderPaymentSchema),
    defaultValues: {
      payment: "",
    },
  });

  async function onSubmit(values: z.infer<typeof selectOrderPaymentSchema>) {
    const productVariations = order?.stepOne?.productVariations?.map((item) => {
      const [id, _price, _name] = item.productVariation.split("?");
      return {
        productVariation: id,
        quantity: item.quantity,
        pricePerUnitOverride: item.pricePerUnitOverride,
      };
    });
    const payload = {
      patient: order?.initialStep?.patient as string,
      address: order?.stepTwo?.address,
      paymentMethodId: values?.payment,
      productVariations: productVariations,
      subtotal: totalAmount,
      coupon: order?.orderAmount?.coupon,
      totalAmount: order?.orderAmount?.totalAmount || totalAmount,
      shippingDetails: order?.selectedAddress?.shippingAddress,
      billingDetails: order?.selectedAddress?.billingAddress,
    };

    await createOrder(payload)
      .unwrap()
      .then((data) => {
        toast.success(data?.message || "Order Created Successfully", {
          duration: 1500,
        });

        dispatch(resetOrder());
        // reset();
        navigate("/orders");
      })
      .catch((err) => {
        console.log("error", err);
        toast.error(err?.data?.message ?? "Something went wrong", {
          duration: 3000,
        });
      });
  }

  async function handleCouponClick() {
    if (!couponRef.current || !couponRef.current?.value) return;

    const lineItems = order?.stepOne?.productVariations?.map((item) => {
      const [id, _price, _name] = item.productVariation.split("?");
      return {
        id,
        quantity: item.quantity,
        total: item.pricePerUnitOverride * item.quantity,
      };
    });

    await validateCoupon({
      patient: order?.initialStep?.patient as string,
      lineItems,
      couponCode: couponRef.current.value,
    })
      .unwrap()
      .then((data) => {
        couponRef.current!.value = "";
        toast.success(data?.message || "Valid Coupon!!!", {
          duration: 1500,
        });

        dispatch(
          updateOrderAmount({
            subtotal: data?.cartTotalBefore?.toString(),
            totalAmount: data?.cartTotalAfter?.toString(),
            coupon: data?.coupon?.code,
            couponDiscount: data?.totalDiscount,
          })
        );
        // dispatch(resetOrder());
        // reset();
        // navigate("/org/patients");
      })
      .catch((err) => {
        console.log("error", err);
        couponRef.current!.value = "";
        toast.error(err?.data?.error ?? "Something went wrong", {
          duration: 3000,
        });
      });
  }

  return (
    <div>
      <div className="max-w-125 mx-auto">
        <div>
          <p className="text-sm font-semibold">
            Coupon <span className="text-red-500 ">*</span>
          </p>
          <div className="flex gap-2 mb-7 mt-1">
            <input
              ref={couponRef}
              className="min-h-11 min-w-91 placeholder:text-[#C3C1C6] border border-[#9EA5AB] px-2 rounded-[6px] text-sm"
              placeholder="Enter Coupon Code"
            />

            <Button
              onClick={handleCouponClick}
              className="min-w-32.5 rounded-[5px] bg-black px-6 py-1.5 text-white min-h-11"
            >
              Apply
            </Button>
          </div>
        </div>
        <div className="p-3.5 rounded-[6px] bg-[#F7F1FD]">
          <h5 className="text-base font-semibold">Order Summary</h5>

          <div className="mb-2">
            {order?.stepOne?.productVariations?.map((item) => {
              return (
                <div
                  className="flex justify-between items-center"
                  key={item.productVariation}
                >
                  <span className="text-sm font-normal">
                    {`${item.productName}`}
                  </span>

                  <span className="tex-sm font-medium">
                    {`$ ${item.pricePerUnitOverride} * ${item.quantity}`}
                  </span>
                </div>
              );
            })}

            <div className=" py-2 border-t border-gray-300">
              {order?.orderAmount?.couponDiscount && (
                <div>
                  {/* <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">
                      Coupon
                      <span className="text-sm italic">{`(${order?.orderAmount?.coupon})`}</span>
                    </span>
                    <span className="tex-sm font-medium">
                      {order?.orderAmount?.coupon}
                    </span>
                  </div> */}
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">
                      Discount
                      <span className="text-sm italic">{` (${order?.orderAmount?.coupon})`}</span>
                    </span>
                    <span className="tex-sm font-medium">{`$ ${order?.orderAmount?.couponDiscount}`}</span>
                  </div>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <span className="tex-sm font-medium ">{`$ ${
                  order?.orderAmount?.totalAmount || totalAmount
                }`}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className=" relative ">
        {isPatiendCardLoading ? (
          <div className="flex justify-center items-center min-h-50 mt-4">
            <LoadingSpinner />
          </div>
        ) : (
          <Form {...form}>
            <form className="mt-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="payment"
                render={({ field }) => (
                  <FormItem className="space-y-2 max-w-125 mx-auto">
                    <FormLabel>Select Payment Method</FormLabel>
                    <FormControl>
                      <RadioGroup
                        className="flex flex-col space-y-1 max-h-50 overflow-y-auto"
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        {data?.data?.paymentMethods?.map((item) => {
                          return (
                            <div
                              key={item.id}
                              className={cn(
                                "px-3.5 py-4 flex justify-between border  rounded-[6px]",
                                field.value === item.id
                                  ? " border-[#008CE3] bg-[#E5F3FC]"
                                  : "border-[#DFDFDFE0]"
                              )}
                            >
                              <Label htmlFor={item.id}>
                                <CreditCard stroke="#3E4D61" size={14} />
                                <span>{`Credit Ending in ${item.last4}`}</span>
                              </Label>
                              <RadioGroupItem id={item.id} value={item.id} />
                            </div>
                          );
                        })}
                      </RadioGroup>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between mt-4 border-t border-card-border border-dashed pt-6">
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
                  {isLoading ? <Spinner /> : <span>Create Order</span>}
                </Button>
              </div>
              {/* <Button type="submit">Submit</Button> */}
            </form>
          </Form>
        )}

        <Button
          type="button"
          variant={"link"}
          className="z-10 cursor-pointer absolute right-28 -top-3  text-xs font-normal underline underline-offset-1 text-[#008CE3]"
          onClick={() => setAddCardModal(true)}
        >
          Add Payment Method
        </Button>
      </div>

      <ConfirmDialog
        open={addCardModal}
        onOpenChange={setAddCardModal}
        title="Add Credit Card"
        onConfirm={() => {}}
        showFooter={false}
      >
        <AddStripeCard
          handleClose={setAddCardModal}
          patientId={order.initialStep.patient as string}
        />
      </ConfirmDialog>
    </div>
  );
}
