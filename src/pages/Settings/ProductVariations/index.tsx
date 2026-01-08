import { productVariationsColumns } from "@/components/data-table/columns/product-variations";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { useDataTable } from "@/hooks/use-data-table";
import { useGetProductVariationsListQuery } from "@/redux/services/productVariationsList";
import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import ProductVariationsSidebar from "./sidebar";
import { ArrowRight } from "lucide-react";

export default function ProductVariations() {
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("per_page") ?? "10", 10);
  const q = searchParams.get("q") ?? "";
  const withoutProducts = searchParams.get("withoutProducts") ?? "";

  const { data, isLoading, isFetching } = useGetProductVariationsListQuery({
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
      <div className="flex flex-col lg:flex-row w-full">
        {/* Main content */}
        <div className="flex-1 min-w-0 py-6 px-10 space-y-4 my-5">
          <div className="flex items-center gap-1.5">
            <span className="text-[26px] font-semibold text-muted-foreground">
              Settings
            </span>
            <ArrowRight stroke="#63627F" />
            <span className="text-[26px] font-semibold">Product List</span>
          </div>
          <div className="space-y-6 bg-white rounded-md shadow-sm">
            {/* Header */}
            <div
              className="bg-white rounded-t-md p-4 mb-4"
              style={{ borderBottom: "1px solid var(--card-border)" }}
            >
              <h1 className="text-base font-semibold">Product List</h1>
            </div>
            {/* Table */}
            <div className="bg-white p-4 rounded-md overflow-hidden">
              <DataTable table={table} isLoading={isLoading} scrollClass={true} />
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
