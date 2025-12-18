import { Badge } from "@/components/ui/badge";
import type { LabOrderInterface } from "@/types/responses/IViewLabOrdes";
import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "@/lib/dayjs";
import { Link } from "react-router-dom";

export function labOrderColumns(): ColumnDef<LabOrderInterface>[] {
  return [
    {
      accessorKey: "labOrderNumber",
      header: "ID",
      cell: ({ row }) => {
        const { labOrderNumber, id } = row.original;
        return (
          <Link
            to={`/lab-orders/${id}`}
            className="text-xs font-medium text-[#008CE3] underline underline-offset-2"
          >
            #{labOrderNumber}
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
            <p className="text-xs font-medium">{patient?.email}</p>
            <p className="text-xs font-normal text-slate">{`${patient?.firstName} ${patient?.lastName}`}</p>
          </div>
        );
      },
    },

    {
      accessorKey: "status",
      header: "Status",

      cell: ({ row }) => {
        const { status } = row.original;

        return status === "pending" ? (
          <Badge className="text-[10px] font-semibold bg-[#CCE5FF] px-2 py-1 rounded-[5px] text-[#004085] min-w-16">
            Pending
          </Badge>
        ) : status === "in_progress" ? (
          <Badge className="text-[10px] font-semibold bg-[#FEF9C3] px-2 py-1 rounded-[5px] text-[#854D0E] min-w-16">
            In Progress
          </Badge>
        ) : (
          <Badge className="bg-[#DCFCE7] text-[#15803D] text-[10px] font-semibold px-2 py-1 rounded-[5px] min-w-16">
            Completed
          </Badge>
        );
      },
    },

    {
      accessorKey: "labPanels",
      header: "Test",

      cell: ({ row }) => {
        const { labPanels } = row.original;
        return (
          <ul>
            {labPanels?.map((item) => {
              return (
                <li id={item.id} className="text-xs font-medium">
                  {item?.title}
                </li>
              );
            })}
          </ul>
        );
      },
    },

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
    // {
    //   accessorKey: "output",
    //   header: "Output",
    //   cell: ({ row }) => <p className="text-sm">{row.original.output}</p>,
    // },
    // {
    //   accessorKey: "isActive",
    //   header: "Active",
    //   cell: ({ row }) => (
    //     <p className="text-sm">{row.original.isActive ? "Yes" : "No"}</p>
    //   ),
    // },
    // {
    //   accessorKey: "createdAt",
    //   header: "Created At",
    //   cell: ({ row }) => {
    //     const formattedDate = new Date(
    //       row.original.createdAt
    //     ).toLocaleDateString("en-US");
    //     return <p className="text-sm">{formattedDate}</p>;
    //   },
    // },
    // {
    //   accessorKey: "id",
    //   header: "Action",
    //   cell: ({ row }) => {
    //     const [selectedProduct, setSelectedProduct] =
    //       useState<EncounterProduct | null>(null);
    //     const [open, setOpen] = useState<boolean>(false);

    //     const handleClick = () => {
    //       setSelectedProduct(row.original);
    //       setOpen(true);
    //     };

    //     return (
    //       <>
    //         <SquarePen
    //           color="#5354ac"
    //           onClick={handleClick}
    //           className="h-4 w-4 cursor-pointer hover:text-blue-500 transition-colors duration-200"
    //         />

    //         {open && (
    //           <UpdateEncounterDialog
    //             open={open}
    //             onOpenChange={setOpen}
    //             selectedProduct={selectedProduct!}
    //           />
    //         )}
    //       </>
    //     );
    //   },
    // },
  ];
}
