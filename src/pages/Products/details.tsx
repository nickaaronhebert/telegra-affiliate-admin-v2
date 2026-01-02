import CubeSVG from "@/assets/icons/Cube";

import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useViewOrderByIdQuery } from "@/redux/services/order";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

const menuItems = [
  {
    title: "Order Overview",
    scrollToId: "orderOverview",
  },
];

export default function ViewOrderDetails() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<
    "patientInformation" | "transmissionDetails" | "orderOverview"
  >("orderOverview");

  const { data: orderData, isLoading } = useViewOrderByIdQuery(id as string);

  if (isLoading || !orderData) {
    return (
      <div className="h-[100vh] flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mb-5">
      <div className="bg-lilac py-3 px-12 flex justify-between items-center">
        <div className="">
          <Link
            to={"/orders"}
            className="font-normal text-sm text text-muted-foreground"
          >
            {"<- Back to Orders"}
          </Link>

          <h1 className="text-2xl font-bold mt-1">
            Order: {orderData?.ecommerceOrderId || orderData?.id}{" "}
          </h1>
        </div>
      </div>

      <div className="flex gap-8 px-14 mt-6">
        <div
          className="w-lg  max-w-80
         rounded-[10px] shadow-[0px_2px_40px_0px_#00000014] h-fit"
        >
          <div className="p-3">
            <div className="flex gap-3.5 items-center ">
              <div className="w-[50px] h-[50px] flex justify-center items-center bg-lilac rounded-[8px]">
                <CubeSVG />
              </div>
              <div>
                <h4 className="text-base font-medium text-black">
                  {orderData?.ecommerceOrderId || orderData?.id}
                </h4>
                <h6 className="text-xs font-normal text-[#3E4D61]">
                  {orderData?.productVariations?.length || 0} Product{" "}
                  {(orderData?.productVariations?.length || 0) !== 1 ? "s" : ""}
                </h6>
              </div>
            </div>
          </div>
          {menuItems.map((item: any, index) => {
            const Icon = item?.icon;
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
                <Icon
                  color={activeTab === item.scrollToId ? "#FFFFFF" : "#9AA2AC"}
                />
                {item.title}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
