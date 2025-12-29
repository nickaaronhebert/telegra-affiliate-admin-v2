import type { ColumnDef } from "@tanstack/react-table";

// import { Badge } from "@/components/ui/badge";

import { Link } from "react-router-dom";

export interface RELATED_ORDER {
  id: string;
  ecommerceOrderId: string;
  status: string;
  totalAmount: number;
  currency: string;
  type: string;
}
export function relatedOrderColumns(): ColumnDef<RELATED_ORDER>[] {
  return [
    {
      accessorKey: "ecommerceOrderId",
      header: "Order ID",

      cell: ({ row }) => {
        const { ecommerceOrderId, id } = row.original;
        return (
          <div>
            <Link
              to={`/order/${id}`}
              className="text-sm font-medium text-[#008CE3] underline underline-offset-2"
            >
              #{ecommerceOrderId}
            </Link>
          </div>
        );
      },
    },

    {
      accessorKey: "type",
      header: "Relationship",
      cell: ({ row }) => {
        const { type } = row.original;
        return (
          <p className="py-1 px-2 text-xs font-normal capitalize">{type}</p>
        );
      },
    },

    // {
    //   accessorKey: "status",
    //   header: "Status",

    //   cell: ({ row }) => {
    //     const { status } = row.original;
    //     return (
    //       <Badge className="px-2 py-1.5 text-xs font-semibold">{status}</Badge>
    //     );
    //   },
    // },
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
      accessorKey: "totalAmount",
      header: "Total",
      cell: ({ row }) => {
        const { totalAmount } = row.original;
        return <p className="text-xs font-normal">${totalAmount}</p>;
      },
    },
  ];
}
