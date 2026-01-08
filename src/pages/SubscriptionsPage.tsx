import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Button } from "@/components/ui/button";
import {
  useDataTable,
  type DataTableFilterField,
} from "@/hooks/use-data-table";
import { useViewAllSubscriptionsQuery } from "@/redux/services/subscription";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {
  organizationSubscriptionColumns,
  type SubscriptionDetails,
} from "@/components/data-table/columns/subscription";
import { useMemo } from "react";

export const SubscriptionsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("per_page") ?? "10", 10);
  const searchQuery = searchParams.get("patient") ?? "";

  const { data, isLoading } = useViewAllSubscriptionsQuery({
    page,
    perPage,
    q: searchQuery,
  });
  const columns = useMemo(() => organizationSubscriptionColumns(), []);

  const filterFields: DataTableFilterField<SubscriptionDetails>[] = [
    {
      label: "Patient",
      value: "patient",
      placeholder: "Search by patient name or email",
    },
  ];

  const { table } = useDataTable({
    data: data?.result || [],
    columns: columns,
    filterFields,
    pageCount: Math.ceil((data?.count || 0) / perPage),
  });

  return (
    <>
      <div className="lg:p-3.5">
        <div className="flex justify-between items-center w-full">
          <div>
            <h1 className="text-2xl font-bold">Subscriptions</h1>
          </div>

          <div className="flex gap-5 items-center">
            <DataTableToolbar
              table={table}
              filterFields={filterFields}
              className="mb-2"
            />
            <Button
              className="px-[20px] py-[5px] min-h-[40px] hover:bg-primary-foreground cursor-pointer rounded-[50px] bg-primary-foreground text-white font-semibold text-[12px] leading-[16px]"
              onClick={() => navigate("/subscriptions/create")}
            >
              Create Subscription
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-3.5 bg-white shadow-[0px_2px_40px_0px_#00000014] pb-[12px]">
        <DataTable table={table} isLoading={isLoading} />
        <DataTablePagination table={table} totalRows={data?.count} />
      </div>
    </>
  );
};
