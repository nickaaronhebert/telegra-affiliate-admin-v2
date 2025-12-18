import { labOrderColumns } from "@/components/data-table/columns/labOrders";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
// import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

import {
  useDataTable,
  // type DataTableFilterField,
} from "@/hooks/use-data-table";
import { cn } from "@/lib/utils";
import { useViewAllLabOrdersQuery } from "@/redux/services/labOrder";

import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
// import { CreateEncounter } from "./Create";
// import { useNavigate } from "react-router-dom";

export default function ViewAllLabOrders() {
  const [status, setStatus] = useState<"pending" | "in_progress" | "complete">(
    "pending"
  );
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("per_page") ?? "100", 10);

  const {
    data: labOrdersData,
    meta,
    isLoading,
  } = useViewAllLabOrdersQuery(
    { page, perPage, status },
    {
      selectFromResult: ({ data, isLoading }) => ({
        data: data?.result,
        meta: data?.count,
        isLoading: isLoading,
        //   isError: isError,
      }),
    }
  );

  const columns = useMemo(() => labOrderColumns(), []);
  //   const filterFields: DataTableFilterField<Encounter>[] = [
  //     {
  //       label: "Status",
  //       value: "status",
  //       placeholder: "Filter By Status",
  //       options: [
  //         { label: "Started", value: "started" },
  //         { label: "In Review", value: "in_review" },
  //         { label: "Completed", value: "completed" },
  //         { label: "Cancelled", value: "cancelled" },
  //       ],
  //     },

  //     {
  //       label: "Name",
  //       value: "patient",
  //       placeholder: "Search By Patient",
  //     },
  //   ];

  const { table } = useDataTable({
    data: labOrdersData || [],
    columns,
    // columns,
    // filterFields,
    pageCount: meta ? Math.ceil(meta / perPage) : -1,
  });

  return (
    <>
      <div className=" lg:p-3.5">
        <div className="flex justify-between items-center w-full">
          <div>
            <h1 className="text-2xl font-bold">Lab Orders</h1>
            {/* <h6 className="font-normal text-sm text text-slate">
              Patient prescription orders and their transmission status
            </h6> */}
          </div>

          <div className="flex gap-5 items-center">
            {/* <DataTableToolbar
              inputClassName="!border-[#9EA5AB] !border"
              facetedClassName={"!border-[#9EA5AB]"}
              table={table}
              filterFields={filterFields}
              className="mb-2"
            /> */}
            {/* <CreateEncounter
              open={openEncounterModal}
              onOpenChange={setOpenEncounterModal}
            /> */}
          </div>
        </div>
      </div>
      <div>
        <div className="flex gap-1.5 ">
          <span
            onClick={() => setStatus("pending")}
            className={cn(
              "cursor-pointer min-w-46.25 rounded-tl-[10px] rounded-tr-[10px] py-3 px-4 text-center text-sm font-medium",
              status === "pending"
                ? "bg-primary text-white"
                : "bg-slate-background text-black"
            )}
          >
            Pending
          </span>

          <span
            onClick={() => setStatus("in_progress")}
            className={cn(
              "cursor-pointer min-w-46.25 rounded-tl-[10px] rounded-tr-[10px] py-3 px-4 text-center text-sm font-medium",
              status === "in_progress"
                ? "bg-primary text-white"
                : "bg-slate-background text-black"
            )}
          >
            In Progress
          </span>

          <span
            onClick={() => setStatus("complete")}
            className={cn(
              "cursor-pointer min-w-46.25 rounded-tl-[10px] rounded-tr-[10px] py-3 px-4 text-center text-sm font-medium",
              status === "complete"
                ? "bg-primary text-white"
                : "bg-slate-background text-black"
            )}
          >
            Completed
          </span>
        </div>
        <div className="mt-2.5 bg-white shadow-[0px_2px_40px_0px_#00000014] pb-3">
          <DataTable table={table} isLoading={isLoading} />
          <DataTablePagination table={table} />
        </div>
      </div>
    </>
  );
}
