import {
  relatedOrderColumns,
  type RELATED_ORDER,
} from "@/components/data-table/columns/relatedOrder";
import { useMemo } from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";

interface RelatedOrderProps {
  data: RELATED_ORDER[];
  isLoading: boolean;
}
export default function RelatedOrder({ data, isLoading }: RelatedOrderProps) {
  const columns = useMemo(() => relatedOrderColumns(), []);
  const { table } = useDataTable({
    data: data || [],
    columns,
    pageCount: data?.length,
  });
  return (
    <div className="p-4">
      <div className="mt-2.5 bg-white shadow-[0px_2px_40px_0px_#00000014] pb-3 h-[200px]">
        <DataTable
          table={table}
          className="min-w-[150px]"
          scrollClass={true}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
