import { useMemo } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import {
  useDataTable,

} from "@/hooks/use-data-table";
import type { PatientDetail, PatientOrder } from "@/types/responses/patient";
import { type ColumnDef } from "@tanstack/react-table";
import PrescriptionSvg from "@/assets/icons/Precription";

interface UserInformationProps {
  patient: PatientDetail;
}

const Prescription = ({ patient }: UserInformationProps) => {
  const columns = useMemo<ColumnDef<PatientOrder>[]>(
    () => [
      {
        accessorKey: "productVariations",
        header: "Medications",
        cell: ({ row }) => {
          const variations = row.getValue("productVariations") as any[];
          if (!variations || variations.length === 0) {
            return <p className="text-xs text-gray-500">No variations</p>;
          }
          return (
            <div className="text-xs">
              <p className="font-medium">{variations.length} variation(s)</p>
              <div className="text-gray-500 space-y-1">
                {variations.slice(0, 3).map((variation, index) => (
                  <div key={index} className="truncate max-w-48">
                    {variation?.productVariation?.product?.title} -
                    {variation?.productVariation?.strength}
                  </div>
                ))}
                {variations.length > 3 && (
                  <p className="text-gray-400">
                    +{variations.length - 3} more...
                  </p>
                )}
              </div>
            </div>
          );
        },
      },

      {
        accessorKey: "refillsAllowed",
        header: "Refills",
        cell: ({ row }) => (
          <div className="text-sm text-gray-900 text-wrap">
            {row.getValue("refillsAllowed") || 0}
          </div>
        ),
      },
      {
        accessorKey: "provider",
        header: "Prescriber",
        cell: ({ row }) => (
          <div className="text-sm text-gray-900">
            {(row.getValue("provider") as any)?.fullName || "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "pharmacy",
        header: "Pharmacy",
        cell: ({ row }) => (
          <div className="text-sm text-gray-900">
            {(row.getValue("pharmacy") as any)?.name || "N/A"}
          </div>
        ),
      },
    ],
    []
  );

  const { table } = useDataTable({
    data: patient?.prescriptions || [],
    columns,
    filterFields: [],
    pageCount: 1,
  });
  return (
    <div
      id="prescriptionsInformation"
      className="bg-white rounded-[10px] shadow-[0px_2px_40px_0px_#00000014] p-6 mb-2.5"
    >
      <div className="flex gap-2 items-center border-b border-card-border justify-between align-middle pb-2">
        <div className="flex gap-2 items-center">
          <PrescriptionSvg color="#000000" width={18} height={18} />
          <h1 className="text-base font-bold ">Prescriptions Data</h1>
        </div>
      </div>
      <div className="mt-3">
        <div
          className={`bg-white shadow-[0px_2px_40px_0px_#00000014] pb-[12px] overflow-y-auto rounded-lg ${
            patient?.prescriptions?.length > 0 ? "h-[350px]" : "h-[200px]"
          }`}
        >
          <DataTable
            table={table}
            scrollClass={true}
            className="min-w-[220px]"
          />
        </div>
        {patient?.prescriptions?.length > 1 && (
          <DataTablePagination table={table} />
        )}
      </div>
    </div>
  );
};
export default Prescription;
