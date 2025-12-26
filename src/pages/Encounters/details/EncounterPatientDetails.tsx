import UserInformationSvg from "@/assets/icons/UserInformation";
import { Button } from "@/components/ui/button";
import type { EncounterDetail } from "@/types/responses/encounter";
import { Link } from "react-router-dom";
import { useState } from "react";
import { TransactionDetailsModal } from "./TransactionDetailsModal";

interface EncounterPatientDetailsProps {
  encounter: EncounterDetail;
}

const EncounterPatientDetails = ({
  encounter,
}: EncounterPatientDetailsProps) => {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  const handleOpenTransaction = () => {
    setIsTransactionModalOpen(true);
  };

  const handleCloseTransaction = () => {
    setIsTransactionModalOpen(false);
  };

  return (
    <div
      id="patientDetails"
      className="bg-white rounded-[10px] shadow-[0px_2px_40px_0px_#00000014] p-6 mb-2.5"
    >
      <div className="flex gap-2 items-center border-b border-card-border pb-4 mb-2 justify-between">
        <div className="flex gap-2 ">
          <UserInformationSvg color="#000000" width={18} height={18} />
          <h1 className="text-base font-bold ">Patient Details</h1>
        </div>
        <div className="flex justify-center items-center gap-3">
          <Link
            to={`/patients/${encounter?.patient?.id}`}
            className="text-sm font-medium text-blue-600 hover:underline"
            target="_blank"
          >
            View Patient
          </Link>
          {encounter?.consultationPaymentIntent?.id && (
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={handleOpenTransaction}
            >
              TRANSACTION
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-b border-card-border pb-2">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">
              Patient Name
            </label>
            <p className="text-sm font-normal">
              {encounter?.patient?.firstName} {encounter?.patient?.lastName}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <p className="text-sm font-normal">{encounter?.patient?.email}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Gender</label>
            <p className="text-sm font-normal capitalize">
              {encounter?.patient?.genderBiological}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              Identified Gender
            </label>
            <p className="text-sm font-normal capitalize">
              {encounter?.patient?.gender || "-"}
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">
              Date of Birth
            </label>
            <p className="text-sm font-normal">
              {encounter?.patient?.dateOfBirth
                ? new Date(encounter.patient.dateOfBirth).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Address</label>
            <p className="text-sm font-normal">
              {encounter?.patient?.addresses[0]?.shipping?.address1 || "-"},{" "}
              {encounter?.patient?.addresses[0]?.shipping?.address2}{" "}
              {encounter?.patient?.addresses[0]?.shipping?.city}{" "}
              {typeof encounter?.patient?.addresses[0]?.shipping?.state ===
              "string"
                ? encounter.patient.addresses[0].shipping.state
                : encounter?.patient?.addresses[0]?.shipping?.state?.name || ""}
            </p>
            <p className="text-sm font-normal">
              {encounter?.patient?.addresses[0]?.billing?.address1},{" "}
              {encounter?.patient?.addresses[0]?.billing?.city}{" "}
              {typeof encounter?.patient?.addresses[0]?.billing?.state ===
              "string"
                ? encounter.patient.addresses[0].billing.state
                : encounter?.patient?.addresses[0]?.billing?.state?.name || ""}
            </p>
          </div>
        </div>
      </div>
      <TransactionDetailsModal
        isOpen={isTransactionModalOpen}
        onClose={handleCloseTransaction}
        transactionId={encounter?.consultationPaymentIntent?.id}
      />
    </div>
  );
};

export default EncounterPatientDetails;
