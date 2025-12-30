import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table/data-table";
import {
  useDataTable,
  type DataTableFilterField,
} from "@/hooks/use-data-table";
import type {
  EncounterDetail,
  EncounterLabOrder,
} from "@/types/responses/encounter";
import { Plus } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { EncounterLabOrderModal } from "./EncounterLabOrderModal";
import LabOrderSvg from "@/assets/icons/LabOrder";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { Link } from "react-router-dom";

interface EncounterLabOrderInformationProps {
  encounter: EncounterDetail;
}

const EncounterLabOrderInformation = ({
  encounter,
}: EncounterLabOrderInformationProps) => {
  const [isLabOrderModalOpen, setIsLabOrderModalOpen] = useState(false);
  const [editingLabOrder, setEditingLabOrder] =
    useState<EncounterLabOrder | null>(null);

  const columns = useMemo<ColumnDef<EncounterLabOrder>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => (
          <div className="text-sm text-gray-900">
            <Link
              to={`${
                import.meta.env.VITE_AFFILIATE_ADMIN_FRONTEND_URL
              }/lab-orders/${row.getValue("id")}`}
              className="font-normal text-sm text text-muted-foreground text-queued hover:underline"
              target="_blank"
            >
              #{row.getValue("id")?.toString().slice(-6)}
            </Link>
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
                (status && statusColors[status as keyof typeof statusColors]) ||
                "bg-gray-100 text-gray-800"
              }`}
            >
              {status || "-"}
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
          const createdAt = row.getValue("createdAt");
          if (!createdAt) {
            return <p className="text-xs font-medium">-</p>;
          }
          const formattedDate = new Date(
            createdAt as string
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

  const filterFields: DataTableFilterField<EncounterLabOrder>[] = [
    {
      label: "status",
      value: "status",
      placeholder: "Search orders...",
    },
  ];

  const { table } = useDataTable({
    data: encounter?.siblingLabOrders || [],
    columns,
    filterFields,
    pageCount: 1,
  });

  const openAddModal = () => {
    setEditingLabOrder(null);
    setIsLabOrderModalOpen(true);
  };

  const closeLabOrderModal = () => {
    setIsLabOrderModalOpen(false);
    setEditingLabOrder(null);
  };

  return (
    <div
      id="labOrdersInformation"
      className="bg-white rounded-[10px] shadow-[0px_2px_40px_0px_#00000014] p-6 mb-2.5"
    >
      <div className="flex gap-2 items-center border-b border-card-border justify-between align-middle pb-4">
        <div className="flex gap-2 items-center">
          <LabOrderSvg color="#000000" width={18} height={18} />
          <h1 className="text-base font-bold ">Lab Order</h1>
        </div>
        <div className="flex justify-between items-center ">
          <Button
            onClick={openAddModal}
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
            encounter?.siblingLabOrders?.length > 0 ? "h-[350px]" : "h-[200px]"
          }`}
        >
          <DataTable
            table={table}
            scrollClass={true}
            className="min-w-[220px]"
          />
        </div>
        {encounter?.siblingLabOrders?.length > 1 && (
          <DataTablePagination table={table} />
        )}
        <EncounterLabOrderModal
          isOpen={isLabOrderModalOpen}
          onClose={closeLabOrderModal}
          order={editingLabOrder}
          encounter={encounter}
        />
      </div>
    </div>
  );
};
export default EncounterLabOrderInformation;
