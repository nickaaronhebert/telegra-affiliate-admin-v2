import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import type { JourneyTemplate } from "@/types/responses/IViewAllJourney";
import type { ICompactTag } from "@/types/responses/tag";
import dayjs from "dayjs";
import { Badge } from "@/components/ui/badge";
import { Pencil, Tag } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { ROUTES } from "@/constants/routes";
import { getLocalStorage } from "@/lib/utils";
import { LOCAL_STORAGE_KEYS } from "@/constants";

export type JourneyDetails = JourneyTemplate;
const REACT_APP_SHOP_FRONTEND_URL = import.meta.env.VITE_SHOP_FRONTEND_URL;
const affiliate = getLocalStorage(LOCAL_STORAGE_KEYS.USER);

// Tag cell component props
interface TagsCellProps {
  tags: ICompactTag[];
  journeyId: string;
  onAssignTags: (journeyId: string, journeyName: string, tags: ICompactTag[]) => void;
  journeyName: string;
}

// Tags cell component for Journey
function JourneyTagsCell({ tags, journeyId, onAssignTags, journeyName }: TagsCellProps) {
  if (!tags || tags.length === 0) {
    return (
      <button
        onClick={() => onAssignTags(journeyId, journeyName, [])}
        className="flex items-center gap-1 text-xs text-[#5456AD] hover:underline cursor-pointer"
      >
        <Tag className="h-3 w-3" />
        Assign Tag
      </button>
    );
  }

  return (
    <div
      className="flex flex-wrap gap-1 cursor-pointer"
      onClick={() => onAssignTags(journeyId, journeyName, tags)}
    >
      {tags.slice(0, 3).map((tag) => (
        <span
          key={tag.id}
          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
          style={{
            backgroundColor: `${tag.color}20`,
            color: tag.color,
            border: `1px solid ${tag.color}40`,
          }}
        >
          {tag.name}
        </span>
      ))}
      {tags.length > 3 && (
        <span className="text-xs text-gray-500">+{tags.length - 3}</span>
      )}
    </div>
  );
}

export function organizationJourneyColumns(
  onAssignTags?: (journeyId: string, journeyName: string, tags: ICompactTag[]) => void
): ColumnDef<JourneyDetails>[] {
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
      accessorKey: "tags",
      header: "Tags",
      cell: ({ row }) => {
        const tags = (row.original.tags || []) as ICompactTag[];
        const journeyId = row.original.id;
        const journeyName = row.original.name;

        return (
          <JourneyTagsCell
            tags={tags}
            journeyId={journeyId}
            journeyName={journeyName}
            onAssignTags={onAssignTags || (() => {})}
          />
        );
      },
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
