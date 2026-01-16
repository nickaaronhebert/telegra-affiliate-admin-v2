import type { ColumnDef } from "@tanstack/react-table";
import type { Subscription } from "@/types/responses/subscription";
import { Badge } from "@/components/ui/badge";
import dayjs from "@/lib/dayjs";
import { Link } from "react-router";

export type SubscriptionDetails = Subscription;

export function organizationSubscriptionColumns(): ColumnDef<SubscriptionDetails>[] {
  return [
    {
      accessorKey: "patient",
      header: "Subscription ID",
      cell: ({ row }) => {
        const { patient, ecommerceSubscriptionId, id } = row.original;
        return (
          <div>
            <Link
              to={`/subscriptions/${id}`}
              className="text-xs font-medium text-[#008CE3] underline"
            >
              #
              {ecommerceSubscriptionId === undefined
                ? "Not synced"
                : ecommerceSubscriptionId}
            </Link>
            <span className="text-xs text-[#3E4D61]"> for </span>
            <Link
              to={'/patients/' + patient?.id}
              className="text-xs font-medium text-[#008CE3] underline"
            >
              {" "}
              {patient?.firstName} {patient?.lastName}{" "}
            </Link>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    // {
    //   accessorKey: "productVariations",
    //   header: "Items",
    //   cell: ({ row }) => {
    //     const items = row.original.productVariations || [];

    //     if (items.length === 0) {
    //       return <p className="text-xs text-gray-400">No items</p>;
    //     }

    //     const first = items[0];
    //     const remaining = items.length - 1;

    //     return (
    //       <div className="text-xs">
    //         {/* First Item Name */}
    //         <p className="font-medium">{first.name}</p>

    //         {/* Quantity */}
    //         <p className="text-[#63627F] font-medium">
    //           {first.quantity} * each
    //         </p>

    //         {/* Extra Items Hyperlink */}
    //         {remaining > 0 && (
    //           <Link
    //             to="#"
    //             className="text-[#008CE3] font-medium underline cursor-pointer"
    //           >
    //             +{remaining} medication{remaining > 1 ? "s" : ""}
    //           </Link>
    //         )}
    //       </div>
    //     );
    //   },
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: "totalAmount",
      header: "Total",
      cell: ({ row }) => {
        const { totalAmount, interval } = row.original;
        return (
          <p className="text-xs font-medium">
            ${totalAmount}{" "}
            <span className="text-[#3E4D61] font-normal">/ {interval}</span>
          </p>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge
            variant={
              status === "pending-cancel"
                ? "pendingCancel"
                : status === "on-hold"
                ? "onHold"
                : status === "cancelled"
                ? "expired"
                : (status as any)
            }
          >
            {status.replace("-", " ").charAt(0).toUpperCase() +
              status.replace("-", " ").slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) => {
        const startDate = dayjs(row.original.startDate);
        const formattedDate = startDate.format("MMMM D, YYYY");
        return <p className="text-xs font-medium">{formattedDate}</p>;
      },
    },
    // {
    //   accessorKey: "nextPayment",
    //   header: "Next Renewal",
    //   cell: ({ row }) => {
    //     const nextPayment = dayjs(row.original.nextPayment);
    //     const formattedDate = nextPayment.format("MMMM D, YYYY");
    //     return <p className="text-xs font-medium">{formattedDate}</p>;
    //   },
    // },
    {
      accessorKey: "order",
      header: "Order",
      cell: ({ row }) => {
        const { parentOrder } = row.original;
        if (!parentOrder) {
          return (
            <div>
              <p className="text-xs font-medium text-gray-400">No order</p>
            </div>
          );
        }
        return (
          <div>
            <Link
              to={`/order/${parentOrder._id}`}
              className="text-xs font-medium text-[#008CE3] underline"
            >
              #{parentOrder.ecommerceOrderId || "N/A"}
            </Link>
          </div>
        );
      },
    },
  ];
}
