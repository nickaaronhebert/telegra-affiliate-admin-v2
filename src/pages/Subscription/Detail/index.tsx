import { DetailsCard } from "@/components/common/Card";
import AddressCard from "@/components/common/Card/address";
import ProductVariations from "@/components/common/Card/productVariation";
import { useViewSubscriptionByIdQuery } from "@/redux/services/subscription";
import { Activity, Pill, Users } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import CubeSVG from "@/assets/icons/Cube";
import { Button } from "@/components/ui/button";

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
  // {
  //   title: "Payment Information",
  //   scrollToId: "paymentInformation",
  //   icon: <CreditCard />,
  // },
];

export default function SubscriptionDetail() {
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
              total: item?.total,
            };
          }) || [],
      },
      isLoading,
    }),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex gap-8 px-14 mt-6">
      <div
        className="w-lg  max-w-80
               rounded-[10px] shadow-[0px_2px_40px_0px_#00000014] h-fit"
      >
        <div className="p-3">
          <div className="flex gap-3.5 items-center ">
            <div className="w-[50px] h-[50px] flex justify-center items-center bg-lilac rounded-xl">
              <CubeSVG />
            </div>
            <div>
              <h4 className="text-base font-semibold text-black">
                {`Subscription #${data?.id ?? "-"}`}
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
              className={`flex justify-start items-center w-full rounded-none text-white text-sm p-5 font-medium cursor-pointer !h-14 ${
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
            id="subscriptionOverview"
            title="Subscription Overview"
            fields={[
              {
                label: "Start Date",
                value: data?.schedule?.startDate || "-",
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
                value: data?.schedule?.endDate || "-",
              },
            ]}
          />
        </div>

        <div className="bg-white rounded-[10px] shadow-[0px_2px_40px_0px_#00000014]">
          <DetailsCard
            title="Patient Details"
            id="patientOverview"
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
            <AddressCard
              title="Billing Details"
              address={data?.billingDetails?.address1 || "-"}
              city={data?.billingDetails?.city || "-"}
              zipcode={data?.billingDetails?.zipcode || "-"}
            />

            <AddressCard
              title="Shipping Details"
              address={data?.shippingDetails?.address1 || "-"}
              city={data?.shippingDetails?.city || "-"}
              zipcode={data?.shippingDetails?.zipcode || "-"}
            />
          </div>
        </div>

        <div className="bg-white rounded-[10px] shadow-[0px_2px_40px_0px_#00000014]">
          <DetailsCard id="orderOverview" title="Order Items" fields={[]} />
          <ProductVariations items={data?.items} />
        </div>
      </div>
    </div>
  );
}
