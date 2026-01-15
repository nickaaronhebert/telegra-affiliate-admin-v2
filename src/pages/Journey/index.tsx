import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Button } from "@/components/ui/button";
import {
  useDataTable,
  type DataTableFilterField,
} from "@/hooks/use-data-table";
import { useViewAllJourneysQuery } from "@/redux/services/journey";
import { useSearchParams, useNavigate } from "react-router-dom";

import {
  organizationJourneyColumns,
  type JourneyDetails,
} from "@/components/data-table/columns/journey";
import { useMemo } from "react";
import { ROUTES } from "@/constants/routes";
import { useGetAffiliateDetailsQuery } from "@/redux/services/organizationIdentity";

export default function Journey() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
    const { data: affiliateDetails } = useGetAffiliateDetailsQuery();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("per_page") ?? "10", 10);
  const name = searchParams.get("name") ?? "";

  // ⬇️ include isFetching (same as Patients page)
  const { data, isLoading, isFetching } = useViewAllJourneysQuery({
    page,
    perPage,
    name,
  });

  const columns = useMemo(() => organizationJourneyColumns(`${affiliateDetails?.shopFrontendUrl}/`),
    [affiliateDetails]);

  const filterFields: DataTableFilterField<JourneyDetails>[] = [
    {
      label: "Name",
      value: "name",
      placeholder: "Search By Journey Name",
    },
  ];

  const { table } = useDataTable({
    data: !(isLoading || isFetching) ? data?.result || [] : [],
    columns,
    filterFields,
    pageCount: Math.ceil((data?.count || 0) / perPage),
  });

  return (
    <>
      <div className="lg:p-3.5">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-2xl font-bold">Journeys</h1>

          <div className="flex gap-5 items-center">
            <DataTableToolbar
              table={table}
              filterFields={filterFields}
              className="mb-2"
            />

            <Button
              className="px-[20px] py-[5px] min-h-[40px] hover:bg-primary-foreground cursor-pointer rounded-[50px] bg-primary-foreground text-white font-semibold text-[12px] leading-[16px]"
              onClick={() => navigate(ROUTES.JOURNEYS_CREATE)}
            >
              Create Journey
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-3.5 bg-white shadow-[0px_2px_40px_0px_#00000014] pb-[12px]">
        {/* ⬇️ Show full spinner until data loads */}
        <DataTable table={table} isLoading={isLoading || isFetching} />

        <DataTablePagination table={table} totalRows={data?.count}/>
      </div>
    </>
  );
}
