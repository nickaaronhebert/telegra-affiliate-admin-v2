import { DetailsCard } from "@/components/common/Card";
import { ConfirmDialog } from "@/components/common/Dialog";
import { useViewLabOrderDetailsQuery } from "@/redux/services/labOrder";
import { useState } from "react";
import { Pill } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import EditLabOrders from "./Edit";
import Header from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { Activity, Plus, Users } from "lucide-react";
import { DetailMenuSidebar } from "@/components/common/Scroller";
import CubeSVG from "@/assets/icons/Cube";
import dayjs from "dayjs";
import AddNotes from "@/components/AddNotes";
import { useDeleteNoteMutation, type Note } from "@/redux/services/notes";
import NoteDetailCard from "@/components/common/NoteDetailCard/NoteDetailCard";
import { stripHtml } from "@/lib/stripHtml";
import { toast } from "sonner";
import { baseApi } from "@/redux/services";
import { TAG_GET_LAB_ORDER } from "@/types/baseApiTags";
import { useAppDispatch } from "@/redux/store";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import NoData from "@/assets/icons/NoData";
import GeneralOverviewSvg from "@/assets/icons/GeneralOverview";
import LabOrderSvg from "@/assets/icons/LabOrder";
import NotesSvg from "@/assets/icons/Notes";

const menuItems = [
  {
    title: "Lab Order Overview",
    scrollToId: "labOrderOverview",
    icon: <Activity color="#9AA2AC" />,
  },
  {
    title: "Patient Details",
    scrollToId: "patientOverview",
    icon: <Users color="#9AA2AC" />,
  },
  {
    title: "Lab Orders",
    scrollToId: "labPanelsOverview",
    icon: <LabOrderSvg color="#9AA2AC" width={18} height={18} />,
  },

  {
    title: "Notes",
    scrollToId: "notesOverview",
    icon: <NotesSvg color="#9AA2AC" />,
  },
];

export default function LabOrderDetails() {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState<string>("labOrderOverview");
  const [deleteNote, { isLoading: isDeleting }] = useDeleteNoteMutation();
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);
  const user = localStorage.getItem("user");
  const affiliate = user ? JSON.parse(user)?.affiliate : "";
  const { data, isLoading, isFetching } = useViewLabOrderDetailsQuery(
    id as string,
    {
      skip: !id,
    }
  );
  const [openEditLabOrder, setOpenEditLabOrder] = useState(false);
  const [openAddNotes, setOpenAddNotes] = useState(false);
  const handleDeleteNote = async () => {
    if (!deleteNoteId) return;

    try {
      await deleteNote(deleteNoteId).unwrap();
      dispatch(
        baseApi.util.invalidateTags([
          { type: TAG_GET_LAB_ORDER, id: data?.id as string },
        ])
      );

      toast.success("Note deleted successfully!");
      setDeleteNoteId(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete note");
    }
  };

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
          <div
            id="labOrderOverview"
            className="bg-white rounded-[10px] shadow-[0px_2px_40px_0px_#00000014]"
          >
            <DetailsCard
              isLoading={isLoading}
              id="#"
              icon={
                <GeneralOverviewSvg color="#000000" width={18} height={18} />
              }
              // id="labOrderOverview"
              title="Lab Order Overview"
              fields={[
                {
                  label: "Status",
                  value: data?.status || "-",
                  isBadge: true,
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
              icon={<Users />}
              actions={
                <div>
                  <Link
                    to={`/patients/${data?.patient?.id}`}
                    className="text-sm font-medium text-queued underline"
                    target="_blank"
                  >
                    View Patient
                  </Link>
                </div>
              }
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
              icon={<LabOrderSvg color="#000000" width={18} height={18} />}
            />

            {isLoading || isFetching ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : data?.labPanels?.length === 0 ? (
              <div className="flex p-4 items-center justify-center flex-col gap-2 mt-4">
                <NoData />
                <span className="text-gray-400">No Lab Orders Found</span>
              </div>
            ) : (
              <div className="p-2">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-5 max-h-75 overflow-y-auto">
                  {data?.labPanels?.map((item) => {
                    return (
                      <div key={item.id} className="border rounded-lg w-full">
                        <div className="text-primary bg-lilac p-2.5 rounded-tl-lg rounded-tr-lg">
                          <span className="flex text-xs font-normal items-center gap-2">
                            <LabOrderSvg
                              color="#5456AD"
                              width={10}
                              height={10}
                            />
                            <span className="text-sm font-semibold">
                              Lab Panel
                            </span>{" "}
                            - {item.title}
                          </span>
                        </div>
                        <div className="p-3">
                          <p className="text-xs font-normal max-h-20 overflow-y-auto">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-[10px] shadow-[0px_2px_40px_0px_#00000014]">
            <DetailsCard
              id=""
              title="Post Result Order"
              icon={<Pill size={16} />}
              fields={[]}
            />

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 max-h-75 overflow-y-auto">
              {data?.afterResultsOrderProductVariations?.map((item) => {
                return (
                  <div className="p-2 space-y-1">
                    <p className="text-sm font-semibold">
                      {item?.productVariation?.description}
                    </p>
                    <p className="text-sm font-normal">
                      Quantity: {item?.quantity}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-[10px] shadow-[0px_2px_40px_0px_#00000014] relative">
            <DetailsCard
              id="notesOverview"
              title="Notes"
              fields={[]}
              icon={<NotesSvg color="#000000" width={18} height={18} />}
            />
            <Button
              onClick={() => setOpenAddNotes(true)}
              className="absolute right-6 top-4 z-50 cursor-pointer  bg-black text-white hover:bg-gray-800 px-4 py-2"
            >
              <Plus className="w-4 h-4 mx-1" />
              ADD NOTE
            </Button>

            <div className="mt-4 space-y-3 p-6 h-[350px] overflow-y-auto rounded-lg">
              {isLoading || isDeleting || isFetching ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />{" "}
                  {/* Assuming LoadingSpinner is a component you already have */}
                </div>
              ) : data?.notes.length === 0 ? (
                <div className="flex justify-center py-8 items-center justify-center flex-col gap-2 mt-4">
                  <NoData />
                  <span className="text-gray-400">No Notes Found</span>
                </div>
              ) : (
                data?.notes.map((note: Note) => (
                  <NoteDetailCard
                    key={note._id}
                    note={note}
                    setDeleteNoteId={setDeleteNoteId}
                    handleDeleteNote={handleDeleteNote}
                    isDeleting={isDeleting}
                    stripHtml={stripHtml}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {openEditLabOrder && (
        <ConfirmDialog
          isLoading={isLoading || isFetching}
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
            afterResultOrders={data?.afterResultsOrderProductVariations?.map(
              (item) => ({
                productVariation: item?.productVariation?.id,
                quantity: String(item?.quantity),
              })
            )}
          />
        </ConfirmDialog>
      )}
      {openAddNotes && (
        <ConfirmDialog
          open={openAddNotes}
          onOpenChange={setOpenAddNotes}
          title="Add a Note"
          description="This will be visible for any admin, not for the patient.You can edit it anytime from the Consultation screen."
          onConfirm={() => {}}
          showFooter={false}
          containerWidth="min-w-[600px] "
        >
          <AddNotes labOrderId={data?.id || ""} closeAction={setOpenAddNotes} />
        </ConfirmDialog>
      )}
    </>
  );
}
