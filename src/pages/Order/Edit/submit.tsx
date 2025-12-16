import { useAppDispatch, useTypedSelector } from "@/redux/store";

import { Button } from "@/components/ui/button";

import { useEditOrderByIdMutation } from "@/redux/services/order";
import { toast } from "sonner";
import { prevStep, resetOrder } from "@/redux/slices/create-order";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";

export default function UpdateOrder({ orderId }: { orderId: string }) {
  const [editOrder, { isLoading }] = useEditOrderByIdMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const order = useTypedSelector((state) => state.order);

  const totalAmount = order?.stepOne?.productVariations
    ?.reduce((acc, cVal) => acc + cVal.pricePerUnitOverride * cVal.quantity, 0)
    ?.toString();

  async function onSubmit() {
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
          onClick={onSubmit}
          disabled={isLoading}
          // disabled={!form.formState.isValid}
          className="rounded-full min-h-12 min-w-[130px] text-[14px] font-semibold text-white cursor-pointer"
        >
          {isLoading ? <Spinner /> : <span>Update Order</span>}
        </Button>
      </div>
    </div>
  );
}
