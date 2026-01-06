import { useState } from "react";
import UserInformationSvg from "@/assets/icons/UserInformation";
import type { PatientDetail } from "@/types/responses/patient";
import { PatientMedicationsTable } from "./PatientMedicationsTable";
import { PatientAllergiesTable } from "./PatientAllergiesTable";
import { EditPatientModal } from "./EditPatientModal";
import { Button } from "@/components/ui/button";

interface UserInformationProps {
  patient: PatientDetail;
}

const UserInformation = ({ patient }: UserInformationProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  return (
    <div
      id="userInformation"
      className="bg-white rounded-[10px] shadow-[0px_2px_40px_0px_#00000014] p-6 mb-2.5"
    >
      <div className="flex gap-2 items-center border-b border-card-border pb-4 mb-2 justify-between">
        <div className="flex gap-2 ">
          <UserInformationSvg color="#000000" width={18} height={18} />
          <h1 className="text-base font-bold ">User Information</h1>
        </div>
        <div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditModalOpen(true)}
            className="p-3 cursor-pointer"
          >
            EDIT
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-b border-card-border pb-2">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">
              Patient Name
            </label>
            <p className="text-sm font-normal break-all">
              {patient?.firstName} {patient?.lastName}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              Biological Gender
            </label>
            <p className="text-sm font-normal capitalize ">
              {patient?.genderBiological}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              Height(in) / Weight(lbs) / BMI
            </label>
            <p className="text-sm font-normal">
              {`${patient?.height ? `${patient?.height} inch` : "-"} / ${
                patient?.weight ? `${patient?.weight} lbs` : "-"
              } / ${patient?.bmi ? `${patient?.bmi?.toFixed(2)}` : "-"}`}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <p className="text-sm font-normal break-all">{patient?.email}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Identified Gender
            </label>
            <p className="text-sm font-normal capitalize">
              {patient?.gender || "-"}
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">
              Date of Birth
            </label>
            <p className="text-sm font-normal break-all">
              {patient?.dateOfBirth
                ? new Date(patient.dateOfBirth).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              Phone Number
            </label>
            <p className="text-sm font-normal">{patient?.phone}</p>
          </div>
        </div>
      </div>

      {patient && <PatientMedicationsTable patient={patient} />}
      {patient && <PatientAllergiesTable patient={patient} />}

      <EditPatientModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        patient={patient}
      />
    </div>
  );
};
export default UserInformation;
