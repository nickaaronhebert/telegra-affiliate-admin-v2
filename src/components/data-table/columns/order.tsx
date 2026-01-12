import type { ColumnDef } from "@tanstack/react-table";
import type { OrderItem } from "@/types/responses/IViewAllOrder";
import dayjs from "@/lib/dayjs";
import { Link } from "react-router-dom";
import { getStatusColors } from "@/lib/utils";

export type OrderDetails = OrderItem;

export function organizationOrderColumns(): ColumnDef<OrderDetails>[] {
  return [
    {
      accessorKey: "ecommerceOrderId",
      header: "Order ID",
      cell: ({ row }) => {
        return (
          <Link
            to={`/order/${row.original.id}`}
            className="text-xs font-medium text-[#008CE3]"
          >
            #{row.getValue("ecommerceOrderId")}
          </Link>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },

    {
      accessorKey: "productVariations",
      header: "Items",
      cell: ({ row }) => {
        return (
          <div className="space-y-1">
            {row.original.productVariations.map((item) => {
              return (
                <div className="flex gap-2 items-center" key={item.id}>
                  <span className="capitalize font-medium text-xs">
                    {item.name}
                  </span>
                  <span className="text-xs text-primary font-semibold px-1.5 py-0.5 rounded-lg bg-secondary">
                    <span>+</span>
                    {item.quantity}
                  </span>
                </div>
              );
            })}
            {row?.original?.productVariations?.length === 0 && <span>-</span>}
          </div>
        );
      },
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const { badge, label } = getStatusColors(status);
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${badge}`}
          >
            {label}
          </span>
        );
      },
    },
    {
      accessorKey: "totalAmount",
      header: "Total Amount",
      cell: ({ row }) => {
        const amount = Number(row.getValue("totalAmount")) || 0;
        return <p className="text-xs font-medium">${amount.toFixed(2)}</p>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created On",
      cell: ({ row }) => {
        const createdDate = dayjs(row.getValue("createdAt"));
        const formattedDate = createdDate.format("MMMM D, YYYY");
        return <p className="text-xs font-medium">{formattedDate}</p>;
      },
    },

    // {
    //   accessorKey: "id",
    //   header: "Action",
    //   cell: ({ row }) => {
    //     return (
    //       <Link
    //         to={`/order/${row.getValue("id")}`}
    //         className="flex justify-center items-center py-1 px-5 w-[85px] h-9 rounded-[50px] border border-primary-foreground "
    //       >
    //         View
    //       </Link>
    //     );
    //   },
    // },
  ];
}
