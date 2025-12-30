import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table/data-table";
import {
  useDataTable,
  type DataTableFilterField,
} from "@/hooks/use-data-table";
import { useSendOrderInviteMutation } from "@/redux/services/patient";
import type { PatientDetail, PatientOrder } from "@/types/responses/patient";
import { toast } from "sonner";
import { Plus, Link as LinkIcon } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { PatientOrderModal } from "./PatientOrderModal";
import { SendInviteModal } from "./SendInviteModal";
import OrderInformationSvg from "@/assets/icons/OrderInformation";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { Link } from "react-router-dom";

interface UserInformationProps {
  patient: PatientDetail;
}

const OrderInformation = ({ patient }: UserInformationProps) => {
  const [sendOrderInvite, { isLoading: isSendingInvite }] =
    useSendOrderInviteMutation();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PatientOrder | null>(null);
  const [editingOrder, setEditingOrder] = useState<PatientOrder | null>(null);

  const columns = useMemo<ColumnDef<PatientOrder>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Encounter ID",
        cell: ({ row }) => (
          <div className="text-sm text-gray-900">
            <Link
              to={`${
                import.meta.env.VITE_AFFILIATE_ADMIN_FRONTEND_URL
              }/encounters/${row.getValue("id")}`}
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
        accessorKey: "productVariations",
        header: "Products",

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
        id: "practitioners",
        header: "Practitioners",
        cell: () => <div className="text-sm text-gray-700">--</div>,
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
      {
        id: "inviteLink",
        header: "Invite Link",
        cell: ({ row }) => {
          const order = row.original;
          return (
            <Button
              size="sm"
              onClick={() => openInviteModal(order)}
              disabled={isSendingInvite}
              className="bg-primary text-white text-sm font-medium cursor-pointer"
            >
              <LinkIcon className="w-4 h-4 mr-1" />
              VISIT
            </Button>
          );
        },
      },
    ],
    [isSendingInvite]
  );

  const filterFields: DataTableFilterField<PatientOrder>[] = [
    {
      label: "status",
      value: "status",
      placeholder: "Search orders...",
    },
  ];

  const { table } = useDataTable({
    data: patient?.orders || [],
    columns,
    filterFields,
    pageCount: 1,
  });

  const handleSendInvite = async (inviteType: "email" | "sms") => {
    if (!selectedOrder) return;
    try {
      await sendOrderInvite({
        orderId: selectedOrder.id,
        data: { inviteType },
      }).unwrap();
      toast.success(`Invite sent via ${inviteType} successfully!`);
      setIsInviteModalOpen(false);
      setSelectedOrder(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send invite");
    }
  };

  const openAddModal = () => {
    setEditingOrder(null);
    setIsOrderModalOpen(true);
  };

  const openInviteModal = (order: PatientOrder) => {
    setSelectedOrder(order);
    setIsInviteModalOpen(true);
  };

  const closeOrderModal = () => {
    setIsOrderModalOpen(false);
    setEditingOrder(null);
  };

  const closeInviteModal = () => {
    setIsInviteModalOpen(false);
    setSelectedOrder(null);
  };
  return (
    <div
      id="ordersInformation"
      className="bg-white rounded-[10px] shadow-[0px_2px_40px_0px_#00000014] p-6 mb-2.5"
    >
      <div className="flex gap-2 items-center border-b border-card-border justify-between align-middle">
        <div className="flex gap-2 items-center">
          <OrderInformationSvg color="#000000" width={18} height={18} />
          <h1 className="text-base font-bold ">Orders</h1>
        </div>
        <div className="flex justify-between items-center mb-4">
          <Button
            onClick={openAddModal}
            className="bg-black text-white hover:bg-gray-800 rounded-lg px-4 py-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 mx-1" />
            ADD ORDER
          </Button>
        </div>
      </div>
      <div className="mt-3">
        <div
          className={`bg-white shadow-[0px_2px_40px_0px_#00000014] pb-[12px] overflow-y-auto rounded-lg ${
            patient?.orders?.length > 0 ? "h-[350px]" : "h-[200px]"
          }`}
        >
          <DataTable
            table={table}
            scrollClass={true}
            className="min-w-[220px]"
          />
        </div>
        {patient?.orders?.length > 1 && <DataTablePagination table={table} />}
        <PatientOrderModal
          isOpen={isOrderModalOpen}
          onClose={closeOrderModal}
          order={editingOrder}
          patient={patient}
        />

        <SendInviteModal
          isOpen={isInviteModalOpen}
          onClose={closeInviteModal}
          onSend={handleSendInvite}
          isLoading={isSendingInvite}
        />
      </div>
    </div>
  );
};
export default OrderInformation;
