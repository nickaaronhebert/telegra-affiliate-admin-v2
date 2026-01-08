import { patientColumns } from "@/components/data-table/columns/patient";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import {
  useDataTable,
  type DataTableFilterField,
} from "@/hooks/use-data-table";
import { useViewAllPatientsQuery } from "@/redux/services/patient";
import { useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import type { Patient } from "@/types/responses/patient";
import { CreatePatient } from "@/pages/Patient/create";

export const PatientsPage = () => {
  const [searchParams] = useSearchParams();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("per_page") ?? "20", 10);
  const firstName = searchParams.get("firstName") ?? "";

  const { data, isLoading, isFetching } = useViewAllPatientsQuery({
    page,
    limit,
    ...(firstName && { firstName }),
  });
  const columns = useMemo(() => patientColumns(), []);

  const filterFields: DataTableFilterField<Patient>[] = [
    {
      label: "name",
      value: "firstName",
      placeholder: "Search By Patient name",
    },
  ];

  const { table } = useDataTable({
    data: !(isFetching || isLoading) ? data?.result || [] : [],
    columns: columns,
    filterFields,
    pageCount: Math.ceil((data?.count || 0) / limit),
  });

  return (
    <div className="w-full min-w-0">
      <div className="lg:p-3.5">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center w-full gap-4">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold">Patients</h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 lg:gap-5 items-stretch sm:items-center">
            <div className="flex-1 min-w-0">
              <DataTableToolbar
                table={table}
                filterFields={filterFields}
                className="mb-2"
              />
            </div>
            <CreatePatient
              open={isCreateModalOpen}
              onOpenChange={setIsCreateModalOpen}
            />
          </div>
        </div>
      </div>
      <div className="mt-3.5 bg-white shadow-[0px_2px_40px_0px_#00000014] pb-[12px] overflow-hidden">
        <DataTable table={table} isLoading={isLoading || isFetching} />
        <DataTablePagination table={table} totalRows={data?.count} />
      </div>
    </div>
  );
};
