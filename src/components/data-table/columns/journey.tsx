import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import type { JourneyTemplate } from "@/types/responses/IViewAllJourney";
import dayjs from "dayjs";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { ROUTES } from "@/constants/routes";
import { getLocalStorage } from "@/lib/utils";
import { LOCAL_STORAGE_KEYS } from "@/constants";

export type JourneyDetails = JourneyTemplate;
const REACT_APP_SHOP_FRONTEND_URL = "https://dev-commerce.telegramd.com/";
const affiliate = getLocalStorage(LOCAL_STORAGE_KEYS.USER);
export function organizationJourneyColumns(): ColumnDef<JourneyDetails>[] {
  return [
    {
      accessorKey: "name",
      header: "Journey Name",
      cell: ({ row }) => {
        return <p className="text-xs font-medium">{row.getValue("name")}</p>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant={status ? (status.toLowerCase() as any) : "active"}>
            {status ? status.toUpperCase() : "PUBLISHED"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "slug",
      header: "Shop URL",
      cell: ({ row }) => {
        return (
          <Link
            to={`${
              affiliate?.shopFrontendUrl || REACT_APP_SHOP_FRONTEND_URL
            }${row.getValue("slug")}`}
            className="text-xs font-normal text-[#5456AD]"
            target="_blank"
            rel="noopener noreferrer"
          >
            {row.getValue("slug")}
          </Link>
        );
      },
    },
    // {
    //   accessorKey: "productVariations",
    //   header: "Products",
    //   cell: ({ row }) => {
    //     const productVariations = row.getValue("productVariations") as any[];
    //     return (
    //       <div>
    //         <p className="text-xs font-medium">{productVariations?.length || 0} Products</p>
    //         {productVariations?.slice(0, 2).map((variation, index) => (
    //           <p className="text-xs text-slate-400" key={index}>
    //             ${variation.pricePerUnitOverride} (Qty: {variation.quantity})
    //           </p>
    //         ))}
    //         {productVariations?.length > 2 && (
    //           <p className="text-xs text-slate-400">+{productVariations.length - 2} more</p>
    //         )}
    //       </div>
    //     );
    //   },
    // },
    // {
    //   accessorKey: "preCheckoutQuestionnaire",
    //   header: "Questionnaires",
    //   cell: ({ row }) => {
    //     const questionnaires = row.getValue("preCheckoutQuestionnaire") as any[];
    //     return (
    //       <div>
    //         <p className="text-xs font-medium">{questionnaires?.length || 0} Questionnaires</p>
    //         {questionnaires?.map((q, index) => (
    //           <p className="text-xs text-slate-400" key={index}>
    //             {q.isPreAuthQuestionnaire ? 'Pre-Auth' : 'Standard'}
    //           </p>
    //         ))}
    //       </div>
    //     );
    //   },
    // },
    {
      accessorKey: "updatedAt",
      header: "Last Updated",
      cell: ({ row }) => {
        const formattedDate = dayjs(row.getValue("updatedAt")).format(
          "MMMM D, YYYY"
        );
        return (
          <>
            <p className="text-xs font-normal">{formattedDate}</p>
          </>
        );
      },
    },
    {
      accessorKey: "id",
      header: "Action",
      cell: ({ row }) => {
        const name = row.getValue("id");

        return (
          <div className="flex items-center space-x-3 pt-3">
            {/* Edit */}
            <Tooltip>
              <TooltipTrigger>
                <Link
                  to={ROUTES.JOURNEYS_EDIT.replace(
                    ":id",
                    (name as string).toLowerCase()
                  )}
                  className="flex justify-center items-center w-9 h-9 rounded-[6px] border border-[0.96px] border-[#D9D9D9] hover:bg-gray-100 transition-all animate-dissolve"
                >
                  <Pencil size={18} />
                </Link>
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>
          </div>
        );
      },
    },
  ];
}
