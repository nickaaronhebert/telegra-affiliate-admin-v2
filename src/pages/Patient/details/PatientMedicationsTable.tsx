import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table/data-table";

import {
  useDataTable,
  type DataTableFilterField,
} from "@/hooks/use-data-table";
import { useUpdatePatientMedicationsMutation } from "@/redux/services/patient";
import type {
  PatientDetail,
  PatientMedication,
} from "@/types/responses/patient";
import { toast } from "sonner";
import { Trash2, Edit, Plus } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import PatientMedicationModal from "./PatientMedicationModal";

interface PatientMedicationsTableProps {
  patient: PatientDetail;
}

export function PatientMedicationsTable({
  patient,
}: PatientMedicationsTableProps) {
  const [updatePatientMedications, { isLoading }] =
    useUpdatePatientMedicationsMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<
    (PatientMedication & { index?: number }) | null
  >(null);

  const columns = useMemo<ColumnDef<PatientMedication>[]>(
    () => [
      {
        accessorKey: "medication",
        header: "Medication",
        cell: ({ row }) => (
          <div className="text-sm text-gray-900">
            {row.getValue("medication")}
          </div>
        ),
      },
      {
        accessorKey: "dosage",
        header: "Dosage",
        cell: ({ row }) => (
          <div className="text-sm text-gray-700">{row.getValue("dosage")}</div>
        ),
      },
      {
        accessorKey: "frequency",
        header: "Frequency",
        cell: ({ row }) => (
          <div className="text-sm text-gray-700">
            {row.getValue("frequency")}
          </div>
        ),
      },
      {
        accessorKey: "conditionPrescribed",
        header: "Condition Prescribed",
        cell: ({ row }) => (
          <div className="text-sm text-gray-700">
            {row.getValue("conditionPrescribed")}
          </div>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const medication = row.original;
          const medicationIndex = row.index;
          return (
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openEditModal(medication, medicationIndex)}
                disabled={isLoading}
                className="p-1 h-8 w-8 cursor-pointer"
              >
                <Edit className="w-4 h-4 text-primary" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteMedication(medicationIndex)}
                disabled={isLoading}
                className="p-1 h-8 w-8 cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-primary" />
              </Button>
            </div>
          );
        },
      },
    ],
    [isLoading]
  );

  const filterFields: DataTableFilterField<PatientMedication>[] = [
    {
      label: "medication",
      value: "medication",
      placeholder: "Search medications...",
    },
  ];

  const { table } = useDataTable({
    data: !isLoading ? patient?.patientMedications || [] : [],
    columns,
    filterFields,
    pageCount: 1,
  });

  const handleAddMedication = (
    newMedication: Omit<PatientMedication, "key">
  ) => {
    const updatedMedications = [
      ...(patient?.patientMedications || []),
      newMedication,
    ];
    updateMedications(updatedMedications, "Medication added successfully!");
  };

  const handleEditMedication = (
    updatedMedication: PatientMedication,
    index: number
  ) => {
    const updatedMedications = [...(patient?.patientMedications || [])];
    updatedMedications[index] = updatedMedication;
    updateMedications(updatedMedications);
  };

  const handleDeleteMedication = (index: number) => {
    const updatedMedications = (patient?.patientMedications || []).filter(
      (_, i) => i !== index
    );
    updateMedications(updatedMedications, "Medication deleted successfully!");
  };

  const updateMedications = async (
    medications: PatientMedication[],
    successMessage = "Medications updated successfully!"
  ) => {
    try {
      await updatePatientMedications({
        id: patient?.id,
        data: {
          patientMedications: medications,
          medicationsConfirmationDate: new Date().toISOString(),
        },
      }).unwrap();
      toast.success(successMessage);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update medications");
    }
  };

  const openEditModal = (medication: PatientMedication, index: number) => {
    setEditingMedication({ ...medication, index });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingMedication(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMedication(null);
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Patient Medications</h2>
        <Button
          onClick={openAddModal}
          className="bg-black text-white hover:bg-gray-800 rounded-lg px-4 py-2 cursor-pointer"
          disabled={isLoading}
        >
          <Plus className="w-4 h-4 mx-1" />
          ADD
        </Button>
      </div>
      <div
        className={`bg-white shadow-[0px_2px_40px_0px_#00000014] pb-[12px] overflow-y-auto rounded-lg h-[200px]`}
      >
        <DataTable
          table={table}
          scrollClass={true}
          className="min-w-[150px]"
          isLoading={isLoading}
        />
      </div>

      <PatientMedicationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        medication={editingMedication}
        onSave={(medication) => {
          if (
            editingMedication &&
            typeof editingMedication.index === "number"
          ) {
            handleEditMedication(medication, editingMedication.index);
          } else {
            handleAddMedication(medication);
          }
        }}
        isLoading={isLoading}
      />
    </div>
  );
}
