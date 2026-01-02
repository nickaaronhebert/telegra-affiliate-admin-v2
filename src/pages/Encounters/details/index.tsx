import CubeSVG from "@/assets/icons/Cube";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ROUTES } from "@/constants/routes";
import { useViewEncounterByIdQuery } from "@/redux/services/encounter";
import { useViewPatientByIdQuery } from "@/redux/services/patient";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ErrorComponent from "@/components/Error";
import EncounterPatientDetails from "./EncounterPatientDetails";
import UserInformationSvg from "@/assets/icons/UserInformation";
import LabOrderSvg from "@/assets/icons/LabOrder";
import QuestionnaireSvg from "@/assets/icons/Questionnaire";
import FilesSvg from "@/assets/icons/Files";
import NotesSvg from "@/assets/icons/Notes";
import EncounterLabOrderInformation from "./EncounterLabOrderInformation";
import PatientFiles from "@/pages/Patient/details/PatientFiles";
import EncounterQuestionnaires from "./EncounterQuestionnaires";
import EncounterNotes from "./EncounterNotes";
import dayjs from "@/lib/dayjs";
import GeneralOverviewSvg from "@/assets/icons/GeneralOverview";
import EncounterGeneralOverview from "./EncounterGeneralOverview";
import SendInviteLink from "./Action/InviteLink";
import Expedite from "./Action/Expedite";
import CancelEncounter from "./Action/Cancel";
import EditOrder from "./Action/Edit";
import TimelineSvg from "@/assets/icons/Timeline";
import EncounterTimeline from "./EncounterTimeline";
import SendPerformVisitLink from "./Action/PerformVisit";
import { EVENT_TYPES, ORDER_STATUS } from "@/constants";
import SubmitOrder from "./Action/Submit";

const menuItems = [
  {
    title: "General Overview",
    scrollToId: "generalOverview",
    icon: GeneralOverviewSvg,
  },
  {
    title: "Patient Details",
    scrollToId: "patientDetails",
    icon: UserInformationSvg,
  },
  {
    title: "Lab Orders",
    scrollToId: "labOrdersInformation",
    icon: LabOrderSvg,
  },
  {
    title: "Encounter Questionnaires",
    scrollToId: "encounterQuestionnairesInformation",
    icon: QuestionnaireSvg,
  },
  {
    title: "Encounter Files",
    scrollToId: "encounterFilesInformation",
    icon: FilesSvg,
  },
  {
    title: "Timeline",
    scrollToId: "encounterTimelineInformation",
    icon: TimelineSvg,
  },
  {
    title: "Notes",
    scrollToId: "encounterNotesInformation",
    icon: NotesSvg,
  },
];

const EncounterDetailsPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<
    | "generalOverview"
    | "patientDetails"
    | "labOrdersInformation"
    | "encounterQuestionnairesInformation"
    | "encounterFilesInformation"
    | "encounterTimelineInformation"
    | "encounterNotesInformation"
  >("generalOverview");

  const {
    data: encounter,
    isLoading,
    error,
  } = useViewEncounterByIdQuery(id as string);

  const { data: patient, isLoading: isPatientLoading } =
    useViewPatientByIdQuery(encounter?.patient?.id as string, {
      skip: !encounter?.patient?.id,
    });

  const affiliateReviewReason = useMemo(() => {
    if (encounter?.status === ORDER_STATUS.RequiresAffiliateReview) {
      const latestAffiliateReviewEvent = encounter?.history
        ?.filter(
          (item) =>
            item?.eventType === EVENT_TYPES.NewStatusSetToRequest &&
            item?.eventData?.newStatus === ORDER_STATUS.RequiresAffiliateReview
        )
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];

      return latestAffiliateReviewEvent?.eventData?.reason || "";
    }
    return "";
  }, [encounter]);

  if (isLoading || isPatientLoading) {
    return (
      <div className="h-[100vh] flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !encounter) {
    return (
      <ErrorComponent
        error={error}
        message={
          error
            ? "Failed to load encounter details. Please try again."
            : "Encounter not found."
        }
        backToPath={ROUTES.PATIENTS_PATH}
        backToText="Back to Encounters"
      />
    );
  }

  return (
    <div className="mb-5">
      <div className="bg-lilac py-3 px-12 flex justify-between items-center">
        <div className="">
          <Link
            to={ROUTES.ENCOUNTERS}
            className="font-normal text-sm text text-muted-foreground"
          >
            {"<- Back to Encounters"}
          </Link>

          <h1 className="text-2xl font-bold mt-1">
            View Encounter: #{encounter.orderNumber}
          </h1>
        </div>

        <div className="flex items-center justify-end gap-2.5">
          {encounter.status === ORDER_STATUS.RequiresOrderSubmission && (
            <SubmitOrder id={encounter?.id} />
          )}
          <EditOrder
            encounterId={encounter?.id}
            projectId={encounter?.project?.id}
            address={encounter?.address}
            patientId={encounter?.patient?.id}
            existingProducts={encounter?.productVariations}
            defaultPaymentMethodId={
              encounter?.consultationPaymentIntent?.paymentMethod
            }
            status={encounter?.status}
          />
          <SendPerformVisitLink
            orderId={encounter?.id}
            affiliateId={encounter?.affiliate?.id}
            status={encounter?.status}
          />
          <SendInviteLink id={encounter?.id} status={encounter?.status} />
          <Expedite id={encounter?.id} status={encounter?.status} />
          <CancelEncounter id={encounter?.id} status={encounter?.status} />
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
                  Encounter #{encounter.orderNumber}
                </h4>
                <h6 className="text-xs font-normal text-[#3E4D61]">
                  {encounter?.createdAt
                    ? dayjs(encounter?.createdAt).fromNow()
                    : ""}
                </h6>
              </div>
            </div>
          </div>
          {menuItems.map((item, index) => {
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
                {Icon && (
                  <Icon
                    color={
                      activeTab === item.scrollToId ? "#FFFFFF" : "#9AA2AC"
                    }
                  />
                )}
                {item.title}
              </Button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {affiliateReviewReason && (
            <div className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
              <p>
                The order has been returned to the Affiliate Review for the
                following reason: <span>{"reason"}</span>
              </p>
            </div>
          )}
          <EncounterGeneralOverview encounter={encounter} />
          <EncounterPatientDetails encounter={encounter} />
          <EncounterLabOrderInformation encounter={encounter} />
          <EncounterQuestionnaires encounter={encounter} patient={patient} />
          {patient && <PatientFiles patient={patient} />}
          <EncounterTimeline encounter={encounter} />
          <EncounterNotes encounter={encounter} />
        </div>
      </div>
    </div>
  );
};
export default EncounterDetailsPage;
