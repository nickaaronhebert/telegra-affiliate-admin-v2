import { useAppDispatch, useTypedSelector } from "@/redux/store";
import { Button } from "@/components/ui/button";
import { useEditOrderByIdMutation } from "@/redux/services/order";
import { toast } from "sonner";
import { prevStep, resetOrder } from "@/redux/slices/create-order";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { useState, useEffect } from "react";
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
import { z } from "zod";
import { cn } from "@/lib/utils";
import { useViewPatientPaymentCardsQuery } from "@/redux/services/paymentMethod";
import { ConfirmDialog } from "@/components/common/Dialog";
import AddStripeCard from "@/components/AddPaymentCard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ORDER_STATUS } from "@/constants";

// Optional payment schema for edit order
const editOrderPaymentSchema = z.object({
  payment: z.string().optional(),
});

export default function UpdateOrder({
  orderId,
  existingPaymentMethodId,
  orderStatus,
}: {
  orderId: string;
  existingPaymentMethodId?: string;
  orderStatus?: string;
}) {
  const [addCardModal, setAddCardModal] = useState(false);
  const [editOrder, { isLoading }] = useEditOrderByIdMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const order = useTypedSelector((state) => state.order);

  const canChangePayment =
    orderStatus !== ORDER_STATUS.OnHold &&
    orderStatus !== ORDER_STATUS.Cancelled;

  const { data, isLoading: isPatientCardLoading } =
    useViewPatientPaymentCardsQuery({
      patient: order.initialStep.patient as string,
    });

  const form = useForm<z.infer<typeof editOrderPaymentSchema>>({
    resolver: zodResolver(editOrderPaymentSchema),
    defaultValues: {
      payment: existingPaymentMethodId || "",
    },
  });

  // Pre-select existing payment method when data loads
  useEffect(() => {
    if (existingPaymentMethodId) {
      form.setValue("payment", existingPaymentMethodId);
    }
  }, [existingPaymentMethodId, form]);

  const totalAmount = order?.stepOne?.productVariations
    ?.reduce((acc, cVal) => acc + cVal.pricePerUnitOverride * cVal.quantity, 0)
    ?.toString();

  async function onSubmit(values: z.infer<typeof editOrderPaymentSchema>) {
    const productVariations = order?.stepOne?.productVariations?.map((item) => {
      const [id, _price, _name] = item.productVariation.split("?");
      return {
        productVariation: id,
        quantity: item.quantity,
        pricePerUnitOverride: item.pricePerUnitOverride,
      };
    });
    const payload = {
      address: order?.stepTwo?.address,
      ...(values?.payment && { paymentMethodId: values.payment }),
      productVariations: productVariations,
      subtotal: totalAmount,
      id: orderId,
      totalAmount: order?.orderAmount?.totalAmount || totalAmount,
      shippingDetails: order?.selectedAddress?.shippingAddress,
      billingDetails: order?.selectedAddress?.billingAddress,
    };

    await editOrder(payload)
      .unwrap()
      .then((data) => {
        toast.success(data?.message || "Order Updated Successfully", {
          duration: 1500,
        });

        dispatch(resetOrder());

        // reset();
        navigate(`/order/${orderId}`);
      })
      .catch((err) => {
        console.log("error", err);
        toast.error(err?.data?.message ?? "Something went wrong", {
          duration: 3000,
        });
      });
  }

  return (
    <div>
      <div className="max-w-[500px] mx-auto">
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
                    {item.productName}
                  </span>
                  <span className="tex-sm font-medium">
                    {`$ ${item.pricePerUnitOverride} * ${item.quantity}`}
                  </span>
                </div>
              );
            })}

            <div className=" py-2 border-t border-gray-300">
              {order?.orderAmount?.couponDiscount && (
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Discount</span>
                  <span className="tex-sm font-medium">{`$ ${order?.orderAmount?.couponDiscount}`}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <span className="tex-sm font-medium">{`$ ${
                  order?.orderAmount?.totalAmount || totalAmount
                }`}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method Section */}
      <div className="relative">
        {isPatientCardLoading ? (
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
                  <FormItem className="space-y-2 max-w-[500px] mx-auto">
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
                                "px-3.5 py-4 flex justify-between border rounded-[6px]",
                                field.value === item.id
                                  ? "border-[#008CE3] bg-[#E5F3FC]"
                                  : "border-[#DFDFDFE0]"
                              )}
                            >
                              <Label htmlFor={item.id}>
                                <CreditCard stroke="#3E4D61" size={14} />
                                <div className="flex flex-col gap-2">
                                  <span>{`Credit Ending in ${item.last4}`}</span>
                                  <span>{`Expires ${item.expMonth}/${item.expYear}`}</span>
                                </div>
                              </Label>
                              <RadioGroupItem
                                id={item.id}
                                value={item.id}
                                disabled={!canChangePayment}
                              />
                            </div>
                          );
                        })}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between mt-6 border-t border-card-border border-dashed pt-6">
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
                  {isLoading ? <Spinner /> : <span>Update Order</span>}
                </Button>
              </div>
            </form>
          </Form>
        )}

        {canChangePayment && (
          <Button
            type="button"
            variant={"link"}
            className="z-10 cursor-pointer absolute right-28 -top-3 text-xs font-normal underline underline-offset-1 text-[#008CE3]"
            onClick={() => setAddCardModal(true)}
          >
            Add Payment Method
          </Button>
        )}
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
