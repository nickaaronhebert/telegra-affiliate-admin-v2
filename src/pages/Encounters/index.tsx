import { encounterColumns } from "@/components/data-table/columns/encounter";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { useDataTable } from "@/hooks/use-data-table";
import { useViewAllEncountersQuery } from "@/redux/services/encounter";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import EncounterStatus from "./EncounterStatus";
import EncounterSearchFilters from "./EncounterSearchFilters";
import { Button } from "@/components/ui/button";
import { UserRound } from "lucide-react";
import { BriefcaseMedical } from "lucide-react";
import { Tag } from "lucide-react";
import { convertToCSV } from "@/lib/convertToCsv";
import dayjs from "dayjs";
import { toast } from "sonner";

export type SearchFiltersProps = {
  adminId?: string;
  adminTitle?: string;
  tagId?: string;
  tagTitle?: string;
  productId?: string;
  productTitle?: string;
};

export default function EncounterList() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("started");
  const [filters, setSearchFilters] = useState<SearchFiltersProps | null>(null);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("per_page") ?? "100", 10);
  const { data, isLoading, isFetching } = useViewAllEncountersQuery({
    page,
    limit: perPage,
    status,
    assignedAffiliateAdmin: filters?.adminId,
    tags: filters?.tagId,
    product: filters?.productId,
  });
  const columns = useMemo(() => encounterColumns(), []);
  const { table } = useDataTable({
    data: data?.result || [],
    columns,
    pageCount: Math.ceil((data?.count || 0) / perPage) || -1,
  });

  function handleDownloadClick() {
    if (data?.result?.length === 0) {
      toast.success("No data to download!!", {
        duration: 1500,
      });
    }
    const downloadedData = data?.result?.map((item) => {
      return {
        orderId: item?.id,
        name: `${item?.patient?.firstName} ${item?.patient?.lastName}`,
        email: item?.patient?.email,
        createdAt: `"${dayjs(item?.createdAt).format("MMMM D, YYYY")}"`,
        product: `"${item?.productVariations
          ?.map((item) => {
            return `${item?.productVariation?.product?.title} ${item?.productVariation?.strength}`;
          })
          ?.join(", ")}"`,
      };
    });

    const result = convertToCSV(downloadedData);
    if (!result) return;

    const csvData = new Blob([result], { type: "text/csv" });
    const csvURL = URL.createObjectURL(csvData);
    const link = document.createElement("a");
    link.href = csvURL;
    link.download = `order.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="p-11.25 ">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h6 className="text-[24px] font-semibold">Encounters</h6>
        </div>

        <div className="flex gap-2.5 items-center">
          <EncounterSearchFilters
            setFilters={setSearchFilters}
            filters={filters}
          />
          <Button
            variant={"ctrl"}
            className="bg-black text-white text-sm"
            onClick={handleDownloadClick}
            disabled={isLoading || isFetching}
          >
            Download Report{" "}
          </Button>
        </div>
      </div>

      <EncounterStatus status={status} setStatus={setStatus} />
      <div className="my-2 flex gap-2 items-center">
        {(filters?.adminTitle ||
          filters?.productTitle ||
          filters?.tagTitle) && (
          <span className="text-[#3E4D61] font-semibold text-sm">
            Active Filters:
          </span>
        )}
        {filters?.adminTitle && (
          <span className="text-xs text-[#0C6FDA] bg-[#E6F7FF] rounded-md border-[#C0E9FF] border flex gap-1 w-fit p-2">
            <UserRound stroke={"#0C6FDA"} size={14} />
            {filters.adminTitle}
          </span>
        )}

        {filters?.productTitle && (
          <span className="text-xs text-[#5FB23B] bg-[#F6FFED] rounded-md border border-[#5FB23B] flex gap-1 w-fit p-2">
            <BriefcaseMedical stroke={"#5FB23B"} size={14} />
            {filters.productTitle}
          </span>
        )}

        {filters?.tagTitle && (
          <span className="text-xs text-[#D67315] bg-[#FFF7E6] rounded-md border border-[#D67315] flex gap-1 w-fit p-2">
            <Tag stroke={"#D67315"} size={14} />
            {filters.productTitle}
          </span>
        )}

        {(filters?.adminTitle ||
          filters?.productTitle ||
          filters?.tagTitle) && (
          <span
            className="font-medium text-sm text-primary underline underline-offset-2 cursor-pointer"
            onClick={() => setSearchFilters(null)}
          >
            Clear all
          </span>
        )}
      </div>

      <div className="mt-2.5 bg-white shadow-[0px_2px_40px_0px_#00000014] pb-3">
        <DataTable table={table} isLoading={isLoading || isFetching} />
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
