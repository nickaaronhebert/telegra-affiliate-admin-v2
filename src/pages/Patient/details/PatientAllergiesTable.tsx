import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table/data-table";
import {
  useDataTable,
  type DataTableFilterField,
} from "@/hooks/use-data-table";
import { useUpdatePatientAllergiesMutation } from "@/redux/services/patient";
import type {
  PatientDetail,
  MedicationAllergy,
} from "@/types/responses/patient";
import { toast } from "sonner";
import { Trash2, Edit, Plus } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { PatientAllergyModal } from "./PatientAllergyModal";

interface PatientAllergiesTableProps {
  patient: PatientDetail;
}

export function PatientAllergiesTable({ patient }: PatientAllergiesTableProps) {
  const [updatePatientAllergies, { isLoading }] =
    useUpdatePatientAllergiesMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAllergy, setEditingAllergy] = useState<
    (MedicationAllergy & { index?: number }) | null
  >(null);

  const columns = useMemo<ColumnDef<MedicationAllergy>[]>(
    () => [
      {
        accessorKey: "medicationAllergies",
        header: "Medication",
        cell: ({ row }) => (
          <div className="text-sm text-gray-900">
            {row.getValue("medicationAllergies")}
          </div>
        ),
      },
      {
        accessorKey: "reaction",
        header: "Reaction",
        cell: ({ row }) => (
          <div className="text-sm text-gray-700">
            {row.getValue("reaction")}
          </div>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const allergy = row.original;
          const allergyIndex = row.index;
          return (
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openEditModal(allergy, allergyIndex)}
                disabled={isLoading}
                className="p-1 h-8 w-8 cursor-pointer"
              >
                <Edit className="w-4 h-4 text-primary" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteAllergy(allergyIndex)}
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

  const filterFields: DataTableFilterField<MedicationAllergy>[] = [
    {
      label: "medication",
      value: "medicationAllergies",
      placeholder: "Search allergies...",
    },
  ];

  const { table } = useDataTable({
    data: !isLoading ? patient?.medicationAllergies || [] : [],
    columns,
    filterFields,
    pageCount: 1,
  });

  const handleAddAllergy = (newAllergy: Omit<MedicationAllergy, "key">) => {
    const updatedAllergies = [
      ...(patient.medicationAllergies || []),
      newAllergy,
    ];
    updateAllergies(updatedAllergies, "Allergy added successfully!");
  };

  const handleEditAllergy = (
    updatedAllergy: MedicationAllergy,
    index: number
  ) => {
    const updatedAllergies = [...(patient.medicationAllergies || [])];
    updatedAllergies[index] = updatedAllergy;
    updateAllergies(updatedAllergies);
  };

  const handleDeleteAllergy = (index: number) => {
    const updatedAllergies = (patient.medicationAllergies || []).filter(
      (_, i) => i !== index
    );
    updateAllergies(updatedAllergies, "Allergy deleted successfully!");
  };

  const updateAllergies = async (
    allergies: MedicationAllergy[],
    successMessage = "Allergies updated successfully!"
  ) => {
    try {
      await updatePatientAllergies({
        id: patient.id,
        data: {
          medicationAllergies: allergies,
          allergiesConfirmationDate: new Date().toISOString(),
        },
      }).unwrap();
      toast.success(successMessage);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update allergies");
    }
  };

  const openEditModal = (allergy: MedicationAllergy, index: number) => {
    setEditingAllergy({ ...allergy, index });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingAllergy(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAllergy(null);
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Medication Allergies</h2>
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
      <PatientAllergyModal
        isOpen={isModalOpen}
        onClose={closeModal}
        allergy={editingAllergy}
        onSave={(allergy) => {
          if (editingAllergy && typeof editingAllergy.index === "number") {
            handleEditAllergy(allergy, editingAllergy.index);
          } else {
            handleAddAllergy(allergy);
          }
        }}
        isLoading={isLoading}
      />
    </div>
  );
}
