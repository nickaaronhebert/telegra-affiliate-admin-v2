import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "@/lib/dayjs";
import { Link } from "react-router-dom";
import type { EncounterList } from "@/redux/services/encounter";

export function encounterColumns(): ColumnDef<EncounterList>[] {
  return [
    {
      accessorKey: "orderNumber",
      header: "Order ID",
      cell: ({ row }) => {
        const { orderNumber } = row.original;
        const encounterId = row.original.id;

        return (
          <Link
            to={`/encounters/${encounterId}`}
            className="text-xs font-medium text-[#008CE3] underline underline-offset-2"
          >
            #{orderNumber}
          </Link>
        );
      },
    },
    {
      accessorKey: "patient",
      header: "Patient",

      cell: ({ row }) => {
        const { patient } = row.original;
        return (
          <div>
            {/* <p className="text-xs font-medium">{patient?.email}</p> */}
            <p className="text-xs font-semibold ">{`${patient?.firstName} ${patient?.lastName}`}</p>
          </div>
        );
      },
    },

    {
      accessorKey: "status",
      header: "Status",

      cell: ({ row }) => {
        const { status } = row.original;

        return <Badge>{status}</Badge>;
      },
    },

    {
      accessorKey: "productVariations",
      header: "Products",
      cell: ({ row }) => {
        const { productVariations } = row.original;
        const initialItem = productVariations?.[0];

        return (
          <div className="flex gap-1 items-center">
            <span className="font-normal text-xs">
              {`${initialItem?.productVariation?.product?.title} ${initialItem?.productVariation?.strength}`}
            </span>

            {productVariations?.length > 1 && (
              <div className="relative group">
                <button className="py-0.5 px-1.5 rounded-[2px] bg-[#F7F1FD] flex items-center text-[10px] font-semibold text-primary cursor-pointer">
                  <span>+</span>
                  <span>{productVariations.length}</span>
                </button>

                {/* Tooltip */}
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 hidden group-hover:block z-50">
                  <div className="relative bg-white border border-gray-200 rounded-md shadow-lg p-2 text-xs text-gray-800 min-w-45">
                    {/* Left Arrow */}
                    <span
                      className="absolute -left-1.75 top-1/2 -translate-y-1/2 w-0 h-0 
  border-t-[7px] border-t-transparent
  border-b-[7px] border-b-transparent
  border-r-[7px] border-r-gray-200"
                    ></span>

                    <span
                      className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-0 h-0 
  border-t-[6px] border-t-transparent
  border-b-[6px] border-b-transparent
  border-r-[6px] border-r-white"
                    ></span>
                    <ul className="list-disc pl-4 space-y-1">
                      {productVariations.map((variation, index) => (
                        <li key={index}>
                          {variation?.productVariation?.product?.title}{" "}
                          {variation?.productVariation?.strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      },
    },

    // {
    //   accessorKey: "labPanels",
    //   header: "Test",

    //   cell: ({ row }) => {
    //     const { labPanels } = row.original;
    //     return (
    //       <ul>
    //         {labPanels?.map((item) => {
    //           return (
    //             <li id={item.id} className="text-xs font-medium">
    //               {item?.title}
    //             </li>
    //           );
    //         })}
    //       </ul>
    //     );
    //   },
    // },

    {
      accessorKey: "createdAt",
      header: "Date",

      cell: ({ row }) => {
        const { createdAt } = row.original;
        const creationDate = createdAt
          ? dayjs(createdAt)?.format("MMMM D, YYYY")
          : "-";
        return <span className="font-normal text-xs ">{creationDate}</span>;
      },
    },
  ];
}
