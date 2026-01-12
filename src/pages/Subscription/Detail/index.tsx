import { DetailsCard } from "@/components/common/Card";
import AddressCard from "@/components/common/Card/address";
import ProductVariations from "@/components/common/Card/productVariation";
import {
  useCancelSubscriptionMutation,
  useViewSubscriptionByIdQuery,
} from "@/redux/services/subscription";
import { Activity, Pill, Users, Box } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import CubeSVG from "@/assets/icons/Cube";
import { Button } from "@/components/ui/button";
import RelatedOrder from "./RelatedOrder";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Header from "@/components/common/Header";
import dayjs from "@/lib/dayjs";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/common/Dialog";
import { toast } from "sonner";
import { CalendarRange, CircleUserRound } from "lucide-react";
import { getStatusColors } from "@/lib/utils";

const menuItems = [
  {
    title: "Subscription Overview",
    scrollToId: "subscriptionOverview",
    icon: <Activity />,
  },
  {
    title: "Patient Details",
    scrollToId: "patientOverview",
    icon: <Users />,
  },

  {
    title: "Items",
    scrollToId: "orderOverview",
    icon: <Pill />,
  },
  {
    title: "Related Orders",
    scrollToId: "relatedOrders",
    icon: <Box />,
  },
  // {
  //   title: "Payment Information",
  //   scrollToId: "paymentInformation",
  //   icon: <CreditCard />,
  // },
];

function SubscriptionLoader() {
  return (
    <div className="w-full flex justify-center items-center p-4">
      <LoadingSpinner />
    </div>
  );
}
export default function SubscriptionDetail() {
  const [cancelSubscription, { isLoading: isCancelSubscriptionLoading }] =
    useCancelSubscriptionMutation();
  const [isCancelled, setIsCancelled] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "subscriptionOverview" | "orderOverview" | "patientOverview"
  >("subscriptionOverview");
  const { id } = useParams();

  const { data, isLoading } = useViewSubscriptionByIdQuery(id as string, {
    skip: !id,
    selectFromResult: ({ data, isLoading }) => ({
      data: {
        ...data,
        items:
          data?.productVariations?.map((item) => {
            return {
              name: item?.name,
              price: item?.pricePerUnitOverride,
              quantity: item?.quantity,
              total: item?.pricePerUnitOverride * item?.quantity,
            };
          }) || [],
      },
      isLoading,
    }),
  });

  useEffect(() => {
    if (data?.status === "cancelled" || data?.status === "pending-cancel") {
      setIsCancelled(true);
    }
  }, [data?.status]);
  
  return (
    <div>
      <Header
        title={`Subscription #${data?.ecommerceSubscriptionId} Details`}
        linkTitle="<- Back to subscriptions"
        linkUrl="/subscriptions"
      >
        <div className="flex items-center gap-2.5 ">
          <Link
            to={`/edit-subscription/${id}`}
            className="rounded-2xl bg-[#3E4D61] text-white py-2 px-5 cursor-pointer text-sm font-semibold"
          >
            Edit Subscription
          </Link>
          {!isCancelled ? (
          <Button
            variant={"transparent"}
            className="border-destructive text-destructive"
            onClick={() => setIsCancelOpen(true)}
          >
            Cancel Subscription
          </Button>
          ) : 
          <Button
            variant={"transparent"}
            className="border-destructive text-destructive cursor-not-allowed"
            disabled={true}
          >
            Cancelled
          </Button>
          }
        </div>
      </Header>
      <div className="flex gap-8 px-14 mt-6">
        <div
          className="w-lg  max-w-80
               rounded-[10px] shadow-[0px_2px_40px_0px_#00000014] h-fit"
        >
          <div className="p-3">
            <div className="flex gap-3.5 items-center ">
              <div className="w-12.5 h-12.5 flex justify-center items-center bg-lilac rounded-xl">
                <CubeSVG />
              </div>
              <div>
                <h4 className="text-base font-semibold text-black">
                  {`Subscription #${data?.ecommerceSubscriptionId ?? "-"}`}
                </h4>
                {/* <h6 className="text-xs font-normal text-[#3E4D61]">
                        {transmissionsLength} Transmission{" "}
                        {transmissionsLength! > 1 ? "s" : ""}
                      </h6> */}
              </div>
            </div>
          </div>
          {menuItems.map((item, index) => {
            return (
              <Button
                key={item.title}
                className={`flex justify-start items-center w-full rounded-none text-white text-sm p-5 font-medium cursor-pointer h-14! ${
                  activeTab === item.scrollToId
                    ? "bg-primary"
                    : "bg-white text-black hover:bg-white"
                }
                    
                    ${
                      index === menuItems.length - 1
                        ? "rounded-bl-[10px] rounded-br-[10px]"
                        : ""
                    }
                    `}
                onClick={() => {
                  setActiveTab(item.scrollToId as any);
                  document.getElementById(item.scrollToId)?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                {item.icon}
                {item.title}
              </Button>
            );
          })}
        </div>

        <div className="w-[70%] space-y-4">
          <div className="bg-white rounded-[10px] shadow-[0px_2px_40px_0px_#00000014]">
            <DetailsCard
              icon={<CalendarRange size={16} />}
              isLoading={isLoading}
              id="subscriptionOverview"
              title="Subscription Overview"
              fields={[
                {
                  label: "Start Date",
                  value:
                    dayjs(data?.schedule?.startDate)?.format("MMMM D, YYYY") ||
                    "-",
                },
                {
                  label: "Billing Interval",
                  value: data?.schedule?.interval || "-",
                },
                {
                  label: "Interval Count",
                  value: data?.schedule?.intervalCount?.toString() || "-",
                },
                {
                  label: "End Date",
                  value:
                    dayjs(data?.schedule?.endDate)?.format("MMMM D, YYYY") ||
                    "-",
                },
              ]}
              topChild={
                <div className="p-4">
                  <div className="rounded-[15px] p-3.75 bg-[#F6F6F6] flex justify-between ">
                    <div>
                      <h5 className="font-normal text-sm text-muted-foreground">
                        Status
                      </h5>
                      <p
                        className={`w-fit px-3 py-1 rounded-l text-xs font-medium uppercase  ${
                          getStatusColors(data?.status as string).badge
                        }`}
                      >
                        {getStatusColors(data?.status as string).label}
                      </p>
                      {isLoading ? (
                        <Skeleton className="h-4 w-32 mt-3" />
                      ) : (
                        <h6 className="font-normal text-sm text-muted-foreground  mt-1">
                          Parent Order
                          <Link
                            to={`/order/${data?.parentOrder?._id}`}
                            className="text-xs text-[#008CE3] cursor-pointer text-sm font-semibold"
                            target="_blank"
                          >
                            {` #${data?.parentOrder?.ecommerceOrderId}`}
                          </Link>
                        </h6>
                      )}
                    </div>
                    <div>
                      <h5 className="font-normal text-sm text-muted-foreground">
                        Recurring Price
                      </h5>
                      <div>
                        {isLoading ? (
                          <Skeleton className="h-4 w-32 mt-3" />
                        ) : (
                          <>
                            <span className="text-lg font-semibold italic">{`$${
                              data?.totalAmount || 0
                            }/`}</span>
                            <span>{data?.schedule?.interval}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              }
            />
          </div>

          <div className="bg-white rounded-[10px] shadow-[0px_2px_40px_0px_#00000014]">
            <DetailsCard
              icon={<CircleUserRound size={16} />}
              title="Patient Details"
              id="patientOverview"
              isLoading={isLoading}
              
              fields={[
                {
                  label: "Patient Name",
                  value:
                    `${data?.patient?.firstName} ${data?.patient?.lastName}` ||
                    "-",
                },
                {
                  label: "Email",
                  value: data?.patient?.email || "-",
                },
              ]}
            />

            <div className="py-4 px-6 flex gap-4">
              {isLoading ? (
                <SubscriptionLoader />
              ) : (
                <>
                  <AddressCard
                    title="Billing Details"
                    address={data?.address?.billing?.address1 || "-"}
                    city={data?.address?.billing?.city || "-"}
                    zipcode={data?.address?.billing?.zipcode || "-"}
                  />

                  <AddressCard
                    title="Shipping Details"
                    address={data?.address?.shipping?.address1 || "-"}
                    city={data?.address?.shipping?.city || "-"}
                    zipcode={data?.address?.shipping?.zipcode || "-"}
                  />
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-[10px] shadow-[0px_2px_40px_0px_#00000014]">
            <DetailsCard
              icon={<Pill size={16} />}
              id="orderOverview"
              title="Order Items"
              fields={[]}
            />
            {isLoading ? (
              <SubscriptionLoader />
            ) : (
              <ProductVariations items={data?.items} />
            )}
          </div>

          <div className="bg-white rounded-[10px] shadow-[0px_2px_40px_0px_#00000014]">
            <DetailsCard
              icon={<Box size={16} />}
              id="relatedOrders"
              title="Related Orders"
              fields={[]}
            />

            <RelatedOrder
              data={data?.relatedOrders || []}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

      {isCancelOpen && (
        <ConfirmDialog
          open={isCancelOpen}
          onOpenChange={setIsCancelOpen}
          title="Cancel Subscription"
          description="Are you sure you want to cancel this subscription? This action cannot be undone and the patient will need to resubscribe."
          cancelText="Keep it"
          confirmText="Cancel Subscription"
          cancelTextClass=""
          confirmTextVariant={"destructive"}
          cancelTextVariant={"transparent"}
          confirmTextClass="rounded-full cursor-pointer min-w-[174px]"
          onConfirm={async () => {
            await cancelSubscription(id as string)
              .unwrap()
              .then((data) => {
                toast.success(data?.message || "Order Cancelled Successfully", {
                  duration: 1500,
                });
                setIsCancelled(true);
                setIsCancelOpen(false);
              })
              .catch((err) => {
                console.log("error", err);
                toast.error("Something went wrong", {
                  duration: 1500,
                });
              });
          }}
          isLoading={isCancelSubscriptionLoading}
        />
      )}
    </div>
  );
}
