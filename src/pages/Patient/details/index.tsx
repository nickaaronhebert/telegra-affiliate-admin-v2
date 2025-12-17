import CubeSVG from "@/assets/icons/Cube";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ROUTES } from "@/constants/routes";
import { useViewPatientByIdQuery } from "@/redux/services/patient";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import ErrorComponent from "@/components/Error";
import UserInformation from "./UserInformation";
import UserInformationSvg from "@/assets/icons/UserInformation";
import OrderInformationSvg from "@/assets/icons/OrderInformation";
import OrderInformation from "./OrderInformation";
import LabOrderSvg from "@/assets/icons/LabOrder";
import PrescriptionSvg from "@/assets/icons/Precription";
import PractitionersSvg from "@/assets/icons/Practitioners";
import TransactionsSvg from "@/assets/icons/Transactions";
import QuestionnaireSvg from "@/assets/icons/Questionnaire";
import FilesSvg from "@/assets/icons/Files";
import PaymentSvg from "@/assets/icons/Payment";
import NotesSvg from "@/assets/icons/Notes";
import LabOrderInformation from "./LabOrderInformation";
import Transaction from "./Transaction";
import Prescription from "./Prescription";
import Practitioners from "./Practitioners";
import Notes from "./Notes";
import PatientQuestionnaires from "./PatientQuestionnaires";
import PatientFiles from "./PatientFiles";
import PaymentMethods from "./PaymentMethods";

const menuItems = [
  {
    title: "User Information",
    scrollToId: "userInformation",
    icon: UserInformationSvg,
  },
  {
    title: "Orders",
    scrollToId: "ordersInformation",
    icon: OrderInformationSvg,
  },
  {
    title: "Lab Orders",
    scrollToId: "labOrdersInformation",
    icon: LabOrderSvg,
  },
  {
    title: "Prescriptions Data",
    scrollToId: "prescriptionsInformation",
    icon: PrescriptionSvg,
  },
  {
    title: "Practitioners",
    scrollToId: "practitionersInformation",
    icon: PractitionersSvg,
  },
  {
    title: "Transactions",
    scrollToId: "transactionsInformation",
    icon: TransactionsSvg,
  },
  {
    title: "Patient Questionnaires",
    scrollToId: "patientQuestionnairesInformation",
    icon: QuestionnaireSvg,
  },
  {
    title: "Patient Files",
    scrollToId: "patientFilesInformation",
    icon: FilesSvg,
  },
  {
    title: "Payment Methods",
    scrollToId: "paymentMethodsInformation",
    icon: PaymentSvg,
  },
  {
    title: "Notes",
    scrollToId: "notesInformation",
    icon: NotesSvg,
  },
];

const PatientDetailsPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<
    | "userInformation"
    | "ordersInformation"
    | "labOrdersInformation"
    | "prescriptionsInformation"
    | "practitionersInformation"
    | "transactionsInformation"
    | "patientQuestionnairesInformation"
    | "patientFilesInformation"
    | "paymentMethodsInformation"
    | "notesInformation"
  >("userInformation");

  const {
    data: patient,
    isLoading,
    error,
  } = useViewPatientByIdQuery(id as string);

  if (isLoading) {
    return (
      <div className="h-[100vh] flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !patient) {
    return (
      <ErrorComponent
        error={error}
        message={error ? "Failed to load patient details. Please try again." : "Patient not found."}
        backToPath={ROUTES.PATIENTS_PATH}
        backToText="Back to Patients"
      />
    );
  }
  return (
    <div className="mb-5">
      <div className="bg-lilac py-3 px-12 flex justify-between items-center">
        <div className="">
          <Link
            to={ROUTES.PATIENTS_PATH}
            className="font-normal text-sm text text-muted-foreground"
          >
            {"<- Back to Patients"}
          </Link>

          <h1 className="text-2xl font-bold mt-1">
            Patient: {patient.firstName} {patient.lastName}
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
                  {patient.firstName} {patient.lastName}
                </h4>
                <h6 className="text-xs font-normal text-[#3E4D61]">
                  {patient.email}
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
          <UserInformation patient={patient} />
          <OrderInformation patient={patient} />
          <LabOrderInformation patient={patient} />
          <Prescription patient={patient} />
          <Practitioners patient={patient} />
          <Transaction patient={patient} />
          <PatientQuestionnaires patient={patient} />
          <PatientFiles patient={patient} />
          <PaymentMethods />
          <Notes patient={patient} />
        </div>
      </div>
    </div>
  );
};
export default PatientDetailsPage;
