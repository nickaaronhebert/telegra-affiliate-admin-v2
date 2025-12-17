import { productVariationsColumns } from "@/components/data-table/columns/product-variations";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import {
  useDataTable,
} from "@/hooks/use-data-table";
import { useGetProductVariationsListQuery } from "@/redux/services/productVariationsList";
import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import ProductVariationsSidebar from "./sidebar";

export default function ProductVariations() {
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("per_page") ?? "10", 10);
  const q = searchParams.get("q") ?? "";
  const withoutProducts = searchParams.get("withoutProducts") ?? "";

  const { data, isLoading, isFetching } =
    useGetProductVariationsListQuery({
      page,
      limit,
      q,
      withoutProducts,
    });

  const columns = useMemo(() => productVariationsColumns(), []);

  const { table } = useDataTable({
    data: !(isLoading || isFetching) ? data?.productVariations || [] : [],
    columns,
    pageCount: Math.ceil((data?.count || 0) / limit),
  });

  return (
    <div className=" min-w-0 overflow-x-hidden">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Main content */}
        <div className="flex-1 min-w-0 p-6">
          <div className="space-y-6 bg-white rounded-md shadow-sm" >
            {/* Header */}
            <div className="bg-white rounded-t-md p-4 mb-4" style={{ borderBottom: "1px solid var(--card-border)" }}>
              <h1 className="text-base font-semibold">Product List</h1>
            </div>
            {/* Table */}
            <div className="bg-white p-4 rounded-md overflow-hidden">
              <DataTable table={table} isLoading={isLoading} />
              <DataTablePagination table={table} />
            </div>
          </div>
        </div>
        {/* Sidebar */}
        <ProductVariationsSidebar />
      </div>
    </div>
  );
}
