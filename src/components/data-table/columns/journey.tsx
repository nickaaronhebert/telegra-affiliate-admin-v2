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

export type JourneyDetails = JourneyTemplate;
const REACT_APP_SHOP_FRONTEND_URL = import.meta.env.VITE_SHOP_FRONTEND_URL;
export function organizationJourneyColumns(shopFrontendUrl?: string): ColumnDef<JourneyDetails>[] {
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
              shopFrontendUrl || REACT_APP_SHOP_FRONTEND_URL
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
