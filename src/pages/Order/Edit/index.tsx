import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
// import SelectPatient from "./Patient";
import { useAppDispatch, useTypedSelector } from "@/redux/store";
import SelectAddress from "../Create/Address";
import { useViewOrderByIdQuery } from "@/redux/services/order";

import { presetOrder } from "@/redux/slices/create-order";
import { useEffect } from "react";
import UpdateOrder from "./submit";
import EcommercePatientDetails from "./Patient";
import EcommerceOrderProductVariation from "./Product";
// import SelectPaymentDetails from "../Create/Payment";
// import SelectProductVariation from "./Product";
// import SelectAddress from "./Address";
// import SelectPaymentDetails from "./Payment";
export interface PatientProps {
  id: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  genderBiological: string;
  name: string;
}
interface EditOrderStepperProps {
  orderId: string;
  patientDetails: PatientProps;
}
function EditOrderStepper({ orderId, patientDetails }: EditOrderStepperProps) {
  const order = useTypedSelector((state) => state.order);
  return (
    <div
      className="mt-10  rounded-[15px] max-w-[815px] mx-auto p-6 bg-white"
      style={{
        boxShadow: "0px 8px 10px 0px hsla(0, 0%, 0%, 0.08)",
      }}
    >
      <div className="pt-2.5 pb-2.5 px-5 flex gap-2.5 justify-center border-b border-card-border border-dashed mb-10">
        <p
          className={cn(
            "text-base font-semibold flex gap-3",
            order.currentStep >= 0 ? "text-primary" : "text-[#63627F]"
          )}
        >
          <span>1.</span>
          <span>Patient Details</span>
        </p>
        <ChevronRight />
        <p
          className={cn(
            "text-base font-semibold flex gap-3",
            order.currentStep >= 1 ? "text-primary" : "text-[#63627F]"
          )}
        >
          <span>2.</span>
          <span>Products</span>
        </p>
        <ChevronRight />
        <p
          className={cn(
            "text-base font-semibold flex gap-3",
            order.currentStep >= 2 ? "text-primary" : "text-[#63627F]"
          )}
        >
          <span>3.</span>
          <span> Address </span>
        </p>
        <ChevronRight />
        <p
          className={cn(
            "text-base font-semibold flex gap-3",
            order.currentStep >= 3 ? "text-primary" : "text-[#63627F]"
          )}
        >
          <span>4.</span>
          <span>Payment</span>
        </p>
      </div>

      {order.currentStep === 0 && (
        <EcommercePatientDetails
          patientId={patientDetails.id}
          disabled={true}
          patientDetails={patientDetails}
        />
        // <SelectPatient
        //   patientId={order.initialStep.patient}
        //   disabled={true}
        //   // addressList={order?.initialStep?.selectedPatient}
        // />
      )}
      {order.currentStep === 1 && (
        <EcommerceOrderProductVariation
          product={order.stepOne}
          disabled={true}
        />
      )}
      {order.currentStep === 2 && (
        <SelectAddress userId={order.initialStep.patient || ""} />
      )}
      {order.currentStep === 3 && <UpdateOrder orderId={orderId} />}
    </div>
  );
}
export default function EditCommerceOrder() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const order = useTypedSelector((state) => state.order.initialStep.patient);
  //   const order = useTypedSelector((state) => state.order);
  //console.log("Order State in CreateCommerceOrder:", order);

  const { data, patientDetails, isLoading, isError } = useViewOrderByIdQuery(
    id as string,
    {
      skip: !id,
      selectFromResult: ({ data, isLoading, isError }) => ({
        data: {
          initialStep: {
            patient: data?.patient?.id || "",
          },
          stepOne: {
            productVariations: data?.productVariations?.map((item) => {
              return {
                productVariation:
                  `${item.id}?${item.pricePerUnitOverride}?${item.name}` || "",
                quantity: item.quantity || 1,
                pricePerUnitOverride: item.pricePerUnitOverride || 0,
                productName: item.name || "",
              };
            }) || [
              {
                productVariation: "",
                quantity: 1,
                pricePerUnitOverride: 0,
                productName: "",
              },
            ],
          },
          stepTwo: {
            address: data?.address?._id || "",
          },
          selectedAddress: {
            shippingAddress: undefined,
            billingAddress: undefined,
            newBillingAddress: false,
            newShippingAddress: false,
          },
          orderAmount: {
            subtotal: data?.subtotal?.toString() || "",
            totalAmount: data?.totalAmount?.toString() || "",
            coupon: data?.coupon || undefined,
            couponDiscount:
              data?.discountAmount && data?.discountAmount > 0
                ? data?.discountAmount.toString()
                : undefined,
          },
        },

        patientDetails: {
          id: data?.patient?.id || "-",
          email: data?.patient?.email || "-",
          phone: data?.patient?.phone || "-",
          name: data?.patient?.name || "-",
          dateOfBirth: data?.patient?.dateOfBirth || "-",
          genderBiological: data?.patient?.genderBiological || "-",
        },
        isLoading,
        isError,
      }),
    }
  );

  useEffect(() => {
    if (!isLoading && !isError && data) {
      dispatch(
        presetOrder({
          currentStep: 0,
          ...data,
        })
      );
    }
  }, [data, dispatch]);

  return (
    <>
      <div className="bg-lilac py-3 px-12">
        <Link
          to={"/org/orders"}
          className="font-normal text-sm text text-muted-foreground"
        >
          {"<- Back to Orders"}
        </Link>

        <h1 className="text-2xl font-bold mt-1">Edit Commerce Order </h1>
      </div>

      {isLoading || isError || !data || !order ? (
        <div className="mt-10  rounded-[15px] max-w-[815px] min-h-[450px] mx-auto p-6 bg-white">
          Loading...
        </div>
      ) : (
        <EditOrderStepper
          orderId={id as string}
          patientDetails={patientDetails}
        />
      )}
    </>
  );
}
