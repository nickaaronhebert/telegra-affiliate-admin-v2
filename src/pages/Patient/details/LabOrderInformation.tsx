import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table/data-table";
import {
  useDataTable,
  type DataTableFilterField,
} from "@/hooks/use-data-table";
import type { PatientDetail, PatientLabOrder } from "@/types/responses/patient";
import { Plus } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
// import { PatientOrderModal } from "./PatientOrderModal";
// import { SendInviteModal } from "./SendInviteModal";
import LabOrderSvg from "@/assets/icons/LabOrder";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";

interface UserInformationProps {
  patient: PatientDetail;
}

const LabOrderInformation = ({ patient }: UserInformationProps) => {


  const columns = useMemo<ColumnDef<PatientLabOrder>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => (
          <div className="text-sm text-gray-900">
            #{row.getValue("id")?.toString().slice(-6)}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",

        cell: ({ row }) => {
          const status = row.getValue("status") as string;
          const statusColors = {
            "on-hold": "bg-yellow-100 text-yellow-800",
            completed: "bg-green-100 text-green-800",
            cancelled: "bg-red-100 text-red-800",
            processing: "bg-blue-100 text-blue-800",
            started: "bg-blue-100 text-blue-800",
          };
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                statusColors[status as keyof typeof statusColors] ||
                "bg-gray-100 text-gray-800"
              }`}
            >
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: "labPanels",
        header: "Tests",
        cell: ({ row }) => {
          const labPanels = row.getValue("labPanels") as any[];
          if (!labPanels || labPanels.length === 0) {
            return <p className="text-xs text-gray-500">No Test</p>;
          }
          return (
            <div className="text-xs">
              <p className="font-medium">{labPanels.length} test(s)</p>
              <div className="text-gray-500 space-y-1">
                {labPanels.slice(0, 3).map((labPanel, index) => (
                  <div key={index} className="truncate max-w-48">
                    {labPanel?.title}
                  </div>
                ))}
                {labPanels.length > 3 && (
                  <p className="text-gray-400">
                    +{labPanels.length - 3} more...
                  </p>
                )}
              </div>
            </div>
          );
        },
      },

      {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => {
          const formattedDate = new Date(
            row.getValue("createdAt")
          ).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
          return <p className="text-xs font-medium">{formattedDate}</p>;
        },
      },
    ],
    []
  );

  const filterFields: DataTableFilterField<PatientLabOrder>[] = [
    {
      label: "status",
      value: "status",
      placeholder: "Search orders...",
    },
  ];

  const { table } = useDataTable({
    data: patient?.labOrders || [],
    columns,
    filterFields,
    pageCount: 1,
  });



  return (
    <div
      id="labOrdersInformation"
      className="bg-white rounded-[10px] shadow-[0px_2px_40px_0px_#00000014] p-6 mb-2.5"
    >
      <div className="flex gap-2 items-center border-b border-card-border justify-between align-middle">
        <div className="flex gap-2 items-center">
          <LabOrderSvg color="#000000" width={18} height={18} />
          <h1 className="text-base font-bold ">Lab Order</h1>
        </div>
        <div className="flex justify-between items-center mb-4">
          <Button
            onClick={() => {}}
            className="bg-black text-white hover:bg-gray-800 rounded-lg px-4 py-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 mx-1" />
            ADD LAB ORDER
          </Button>
        </div>
      </div>
      <div className="mt-3">
        <div
          className={`bg-white shadow-[0px_2px_40px_0px_#00000014] pb-[12px] overflow-y-auto rounded-lg ${
            patient?.labOrders?.length > 0 ? "h-[350px]" : "h-[200px]"
          }`}
        >
          <DataTable
            table={table}
            scrollClass={true}
            className="min-w-[220px]"
          />
        </div>
        {patient?.labOrders?.length > 1 && (
          <DataTablePagination table={table} />
        )}
        {/* <PatientOrderModal
          isOpen={isOrderModalOpen}
          onClose={closeOrderModal}
          order={editingOrder}
        />  */}
      </div>
    </div>
  );
};
export default LabOrderInformation;
