import { useViewSubscriptionByIdQuery } from "@/redux/services/subscription";
import { presetSubscription } from "@/redux/slices/subscription";
import { useAppDispatch, useTypedSelector } from "@/redux/store";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Patient from "../Create/Patient";
import ProductVariation from "../Create/Product";
import EditSubscriptionAddress from "./SelectAddress";
import dayjs from "@/lib/dayjs";

function EditSubscriptionStepper({
  subscriptionId,
}: {
  subscriptionId: string;
}) {
  const subscriptionDetails = useTypedSelector((state) => state.subscription);

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

      {subscriptionDetails.currentStep === 0 && <Patient disabled={true} />}

      {subscriptionDetails.currentStep === 1 && (
        <ProductVariation
          patientId={subscriptionDetails?.patient?.patient as string}
        />
      )}

      {subscriptionDetails.currentStep === 2 && (
        <EditSubscriptionAddress id={subscriptionId} />
      )}
    </div>
  );
}
export default function EditSubscription() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const subscription = useTypedSelector(
    (state) => state.subscription.patient.patient
  );
  const { data, isLoading, isError } = useViewSubscriptionByIdQuery(
    id as string,
    {
      skip: !id,
      selectFromResult: ({ data, isLoading, isError }) => ({
        data: {
          patient: {
            email: data?.patient?.email,
            firstName: data?.patient?.firstName,
            lastName: data?.patient?.lastName,
            patient: data?.patient?.id,
            // patient: `${data?.patient?.firstName}/${data?.patient?.lastName}/${data?.patient?.phone}/${data?.patient?.email}/${data?.patient?.id}`,
            phoneNumber: data?.patient?.phone,
            gender: data?.patient?.genderBiological,
            medicationAllergies: data?.patient?.medicationAllergies || [],
            currentMedications: data?.patient?.patientMedications || [],
          },
          product: {
            order: data?.parentOrder?._id || "",
            schedule: {
              interval: data?.schedule?.interval || "",
              intervalCount: data?.schedule?.intervalCount || 0,
              startDate: data?.schedule?.startDate
                ? dayjs(data.schedule.startDate)?.format("MM/DD/YYYY")
                : "",
              endDate: data?.schedule?.endDate
                ? dayjs(data.schedule.endDate)?.format("MM/DD/YYYY")
                : undefined,
            },
            productVariations: data?.productVariations?.map((item) => {
              return {
                productVariation: `${item?._id}?${item?.regularPrice}?${item?.name}`,
                quantity: item?.quantity,
                pricePerUnitOverride: item?.pricePerUnitOverride,
                productName: item?.name,
              };
            })!,
          },
          sub_address: {
            address: data?.address?._id || "",
          },
          selectedAddress: {
            shippingAddress: undefined,
            billingAddress: undefined,
            newBillingAddress: false,
            newShippingAddress: false,
          },
        },
        isLoading,
        isError,
      }),
    }
  );

  useEffect(() => {
    if (!isLoading && !isError && data) {
      dispatch(
        presetSubscription({
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
          to={"/subscriptions"}
          className="font-normal text-sm text text-muted-foreground"
        >
          {"<- Back to Subscriptions"}
        </Link>

        <h1 className="text-2xl font-bold mt-1">Edit Subscription </h1>
      </div>

      {isLoading || isError || !data || !subscription ? (
        <div className="mt-10  rounded-[15px] max-w-[815px] min-h-[450px] mx-auto p-6 bg-white">
          Loading...
        </div>
      ) : (
        <EditSubscriptionStepper subscriptionId={id!} />
      )}
    </>
  );
}
