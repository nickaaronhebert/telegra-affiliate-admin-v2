import type { ColumnDef } from "@tanstack/react-table";

// import { Badge } from "@/components/ui/badge";

import { Link } from "react-router-dom";
import { getStatusColors } from "@/lib/utils";

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
              target="_blank"
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
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
              getStatusColors(status).badge
            }`}
          >
            {getStatusColors(status)?.label}
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
