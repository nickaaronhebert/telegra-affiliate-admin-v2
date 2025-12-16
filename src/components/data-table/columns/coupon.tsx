import type { ColumnDef } from "@tanstack/react-table";
import type { Coupon } from "@/types/responses/coupon";
import { Badge } from "@/components/ui/badge";
import CopySVG from "@/assets/icons/Copy";
import { toast } from "sonner";
import { copyToClipboard } from "@/lib/utils";
import dayjs from "@/lib/dayjs";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

export type CouponDetails = Coupon;

export function organizationCouponColumns(): ColumnDef<CouponDetails>[] {
  return [
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => {
        const couponCode = row.getValue("code") as string;
        const id = row.original["id"] as string;

        const handleCopy = async () => {
          const success = await copyToClipboard(couponCode);
          if (success) {
            toast.success("Coupon code copied to clipboard!");
          } else {
            toast.error("Failed to copy coupon code");
          }
        };

        return (
          <div className="flex items-center gap-2">
            <Link to={ROUTES.COUPONS_EDIT.replace(":id", id)} className="text-xs font-semibold text-[#008CE3]">{couponCode}</Link>
            <button
              onClick={handleCopy}
              className="p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer"
              title="Copy to clipboard"
            >
              <CopySVG />
            </button>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        return <p className="text-xs font-normal">{row.getValue("description")}</p>;
      },
    },
    {
      accessorKey: "discountType",
      header: "Type",
      cell: ({ row }) => {
        const discountType = row.getValue("discountType") as string;
        return (
          <div>
            <p className="text-xs mt-1 font-normal">
              {discountType === "percent" ? "Percent(%)" : "Amount($)"}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "value",
      header: "Value",
      cell: ({ row }) => {
        const discountType = row.getValue("discountType") as string;
        const amount = row.original.amount;
        return (
          <div>
            <p className="text-xs font-normal">
              {discountType === "percent" ? `${amount}%` : `$${amount}`}
            </p>
            {/* <p className="text-xs mt-1">
              {discountType === "percent" ? "Percent(%)" : "Amount($)"}
            </p> */}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const getVariant = (status: string) => {
          switch (status) {
            case "active":
              return "active";
            case "draft":
              return "draft";
            case "expired":
              return "expired";
            case "disabled":
              return "disabled";
            default:
              return "default";
          }
        };
        return (
          <Badge variant={getVariant(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    // {
    //   accessorKey: "usageCount",
    //   header: "Usage",
    //   cell: ({ row }) => {
    //     const usageCount = row.getValue("usageCount") as number;
    //     const usageLimit = row.original.usageLimit;
    //     const usageLimitPerUser = row.original.usageLimitPerUser;
    //     return (
    //       <div>
    //         <p className="text-xs font-normal">{usageCount}/{usageLimit} used</p>
    //         <p className="text-xs text-slate-400">Max {usageLimitPerUser} per user</p>
    //       </div>
    //     );
    //   },
    // },
    {
      accessorKey: "dateExpires",
      header: "Valid Period",
      cell: ({ row }) => {
        const expiryDate = dayjs(row.getValue("dateExpires"));
        const isExpired = expiryDate.isBefore(dayjs());
        const formattedDate = expiryDate.format("MMMM D, YYYY");
        return (
          <div>
            <p className={`text-xs font-normal ${isExpired ? 'text-red-600' : ''}`}>
              {formattedDate}
            </p>
            {isExpired && (
              <p className="text-xs text-red-400">Expired</p>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created On",
      cell: ({ row }) => {
        const createdDate = dayjs(row.getValue("createdAt"));
        const formattedDate = createdDate.format("MMMM D, YYYY");
        return (
          <p className="text-xs font-normal">{formattedDate}</p>
        );
      },
    },
  ];
}