import { DetailsCard } from "@/components/common/Card";
import { ConfirmDialog } from "@/components/common/Dialog";
import { useViewLabOrderDetailsQuery } from "@/redux/services/labOrder";
import { useState } from "react";
import { useParams } from "react-router-dom";
import EditLabOrders from "./Edit";
import Header from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { Activity, Pill, Users } from "lucide-react";
import { DetailMenuSidebar } from "@/components/common/Scroller";
import CubeSVG from "@/assets/icons/Cube";
import dayjs from "dayjs";

const menuItems = [
  {
    title: "Lab Order Overview",
    scrollToId: "labOrderOverview",
    icon: <Activity />,
  },
  {
    title: "Patient Details",
    scrollToId: "patientOverview",
    icon: <Users />,
  },

  {
    title: "Items",
    scrollToId: "labPanelsOverview",
    icon: <Pill />,
  },
];

export default function LabOrderDetails() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<string>("labOrderOverview");

  const user = localStorage.getItem("user");
  const affiliate = user ? JSON.parse(user)?.affiliate : "";
  const { data, isLoading } = useViewLabOrderDetailsQuery(id as string, {
    skip: !id,
  });

  const [openEditLabOrder, setOpenEditLabOrder] = useState(false);

  return (
    <>
      <Header
        linkTitle="<- Back to Lab Orders"
        linkUrl="/lab-orders"
        title={`Lab Order for ${data?.patient?.firstName} ${data?.patient?.lastName}`}
      >
        <div>
          <Button
            variant={"outline"}
            className="bg-transparent rounded-[50px] border border-black cursor-pointer"
            onClick={() => setOpenEditLabOrder(true)}
          >
            Edit Lab Order
          </Button>
        </div>
      </Header>

      <div className="flex gap-8 px-14 mt-6">
        <DetailMenuSidebar
          menuItems={menuItems}
          title={`ID #${data?.labOrderNumber}`}
          icon={<CubeSVG />}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="space-y-6 lg:w-[70%]">
          <div className="bg-white rounded-[10px] shadow-[0px_2px_40px_0px_#00000014]">
            <DetailsCard
              isLoading={isLoading}
              id="labOrderOverview"
              title="Lab Order Overview"
              fields={[
                {
                  label: "Status",
                  value: data?.status || "-",
                },
                {
                  label: "Date",
                  value: data?.createdAt
                    ? dayjs(data.createdAt).format("MMM D, YYYY h:mm:ss A")
                    : "-",
                },
                {
                  label: "Lab Order ID",
                  value: data?.id || "-",
                  capitalize: false,
                },
              ]}
            />
          </div>

          <div className="bg-white rounded-[10px] shadow-[0px_2px_40px_0px_#00000014]">
            <DetailsCard
              isLoading={isLoading}
              id="patientOverview"
              title="Patient Details"
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
                  capitalize: false,
                },
                {
                  label: "Date of Birth",
                  value: data?.patient?.dateOfBirth
                    ? dayjs(data.patient.dateOfBirth).format(
                        "MMM D, YYYY h:mm:ss A"
                      )
                    : "-",
                },
                {
                  label: "Biological Gender",
                  value: data?.patient?.genderBiological || "-",
                },
                {
                  label: "Identified Gender",
                  value: data?.patient?.gender || "-",
                },

                {
                  label: "Phone Number",
                  value: data?.patient?.phone || "-",
                },
              ]}
            />
          </div>

          <div className="bg-white rounded-[10px] shadow-[0px_2px_40px_0px_#00000014]">
            <DetailsCard
              id="labPanelsOverview"
              title="Lab Orders"
              fields={[]}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 p-5">
              {data?.labPanels?.map((item) => {
                return (
                  <div key={item.id} className="">
                    <p className="text-sm font-medium text-primary underline underline-offset-2">
                      {item.title}
                    </p>
                    <p className="text-xs font-normal">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {openEditLabOrder && (
        <ConfirmDialog
          open={openEditLabOrder}
          onOpenChange={setOpenEditLabOrder}
          title="Edit Lab Order"
          onConfirm={() => {}}
          showFooter={false}
          containerWidth="min-w-[900px] "
        >
          <EditLabOrders
            handleClose={setOpenEditLabOrder}
            userId={data?.patient?.id}
            labId={data?.lab?.id || ""}
            labName={data?.lab?.name || ""}
            labPanels={data?.labPanels?.map((item) => item.id) || []}
            labOrderId={id!}
            affiliate={affiliate}
            address={{
              address1: data?.address?.shipping?.address1 || "",
              address2: data?.address?.shipping?.address2 || "",
              city: data?.address?.shipping?.city || "",
              state: data?.address?.shipping?.state?.id || "",
              zipcode: data?.address?.shipping?.zipcode || "",
            }}
          />
        </ConfirmDialog>
      )}
    </>
  );
}
