import Header from "@/components/common/Header";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { useTypedSelector } from "@/redux/store";
import { ChevronRight } from "lucide-react";
import Patient from "./Patient";
import ProductVariation from "./Product";
import SubscriptionAddress from "./Address";

export default function CreateSubscription() {
  const subscriptionDetails = useTypedSelector((state) => state.subscription);
  //   console.log("****", subscriptionDetails);
  return (
    <div>
      <Header
        linkTitle={`<- Back to Subscriptions`}
        linkUrl={ROUTES.SUBSCRIPTIONS}
        title="Add Subscription"
      />

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
              subscriptionDetails.currentStep >= 0
                ? "text-primary"
                : "text-[#63627F]"
            )}
          >
            <span>1.</span>
            <span>Patient Details</span>
          </p>
          <ChevronRight />
          <p
            className={cn(
              "text-base font-semibold flex gap-3",
              subscriptionDetails.currentStep >= 1
                ? "text-primary"
                : "text-[#63627F]"
            )}
          >
            <span>2.</span>
            <span>Products</span>
          </p>
          <ChevronRight />
          <p
            className={cn(
              "text-base font-semibold flex gap-3",
              subscriptionDetails.currentStep >= 2
                ? "text-primary"
                : "text-[#63627F]"
            )}
          >
            <span>3.</span>
            <span> Address </span>
          </p>
          {/* <ChevronRight />
          <p
            className={cn(
              "text-base font-semibold flex gap-3",
              subscriptionDetails.currentStep >= 3
                ? "text-primary"
                : "text-[#63627F]"
            )}
          >
            <span>4.</span>
            <span>Payment</span>
          </p> */}
        </div>

        {subscriptionDetails.currentStep === 0 && <Patient />}
        {subscriptionDetails.currentStep === 1 && (
          <ProductVariation
            patientId={subscriptionDetails?.patient?.patient as string}
          />
        )}
        {subscriptionDetails.currentStep === 2 && <SubscriptionAddress />}
      </div>
    </div>
  );
}
