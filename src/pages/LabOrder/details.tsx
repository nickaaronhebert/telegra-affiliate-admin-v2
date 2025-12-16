import { DetailsCard } from "@/components/common/Card";
import { ConfirmDialog } from "@/components/common/Dialog";
import { useViewLabOrderDetailsQuery } from "@/redux/services/labOrder";
import { useState } from "react";
import { useParams } from "react-router-dom";
import EditLabOrders from "./Edit";
import Header from "@/components/common/Header";
import { Button } from "@/components/ui/button";

export default function LabOrderDetails() {
  const { id } = useParams();
  const { data } = useViewLabOrderDetailsQuery(id as string, {
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
      <div className="space-y-6">
        <div className="bg-white rounded-[10px] shadow-[0px_2px_40px_0px_#00000014]">
          <DetailsCard
            id="labOrderOverview"
            title="Lab Order Overview"
            fields={[
              {
                label: "Status",
                value: data?.status || "-",
              },
              {
                label: "Date",
                value: data?.createdAt || "-",
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
                value: data?.patient?.dateOfBirth || "-",
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
          <DetailsCard id="labOrderOverview" title="Lab Orders" fields={[]} />
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

      {openEditLabOrder && (
        <ConfirmDialog
          open={openEditLabOrder}
          onOpenChange={setOpenEditLabOrder}
          title="Edit Lab Order"
          onConfirm={() => {}}
          showFooter={false}
          containerWidth="min-w-[900px]"
        >
          <EditLabOrders
            userId={data?.patient?.id}
            labId={data?.lab?.id || ""}
            labName={data?.lab?.name || ""}
          />
        </ConfirmDialog>
      )}
    </>
  );
}
