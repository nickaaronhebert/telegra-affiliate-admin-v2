import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import SelectPatient from "./Patient";
import { useTypedSelector } from "@/redux/store";
import SelectProductVariation from "./Product";
import SelectAddress from "./Address";
import SelectPaymentDetails from "./Payment";

export default function CreateCommerceOrder() {
  const order = useTypedSelector((state) => state.order);
  return (
    <>
      <div className="bg-lilac py-3 px-12">
        <Link
          to={"/orders"}
          className="font-normal text-sm text text-muted-foreground"
        >
          {"<- Back to Orders"}
        </Link>

        <h1 className="text-2xl font-bold mt-1">Create Commerce Order </h1>
      </div>
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
          <SelectPatient
            patientId={order.initialStep.patient}

            // addressList={order?.initialStep?.selectedPatient}
          />
        )}
        {order.currentStep === 1 && (
          <SelectProductVariation product={order.stepOne} />
          //   <SelectProductVariant
          //     productVariant={order.stepOne}
          //     state={order.initialStep.dispensingAddress.state}
          //   />
        )}
        {order.currentStep === 2 && (
          <SelectAddress userId={order.initialStep.patient || ""} />
        )}

        {order.currentStep === 3 && <SelectPaymentDetails />}
        {/* {order.currentStep === 2 && (
          <SelectProviderPharmacy providerPharmacy={order.stepTwo} />
        )} */}
        {/* {order.currentStep === 3 && (
          <SelectPatientAddress
            // dispensingAddress={order.stepThree}
            // addressList={order?.initialStep?.selectedPatient}
            selectedMethod={order.stepThree.transmissionMethod}
          />
        )} */}

        {/* {order.currentStep === 4 && <ReviewOrderDetails order={order} />} */}
      </div>
    </>
  );
}
