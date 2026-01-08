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
import { Input } from "@/components/ui/input";
import { X, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: "",
    endDate: "",
  });

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

  // Filter data based on date range
  const getFilteredData = () => {
    let filteredData = data?.result || [];
    if (dateRange.startDate || dateRange.endDate) {
      filteredData = filteredData.filter((item) => {
        const itemDate = dayjs(item?.createdAt);

        if (dateRange.startDate) {
          const startDate = dayjs(dateRange.startDate).startOf("day");
          if (itemDate.isBefore(startDate)) return false;
        }

        if (dateRange.endDate) {
          const endDate = dayjs(dateRange.endDate).endOf("day");
          if (itemDate.isAfter(endDate)) return false;
        }

        return true;
      });
    }
    return filteredData;
  };

  const filteredData = getFilteredData();

  const { table } = useDataTable({
    data: filteredData,
    columns,
    pageCount: Math.ceil((filteredData?.length || 0) / perPage) || -1,
  });

  function handleDownloadClick() {
    if (filteredData.length === 0) {
      toast.error("No data to download!!", {
        duration: 1500,
      });
      return;
    }

    const downloadedData = filteredData?.map((item) => {
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
          
          <div
            className="relative inline-block"
            onMouseEnter={() => setDatePickerOpen(true)}
            onMouseLeave={() => setDatePickerOpen(false)}
          >
            {/* Date Picker Button */}
            <div
              style={{
                boxShadow: "0px 8px 10px 0px hsla(0, 0%, 0%, 0.08)",
              }}
              className={cn(
                "cursor-pointer text-sm font-normal text-[#63627F] min-w-52.5 border py-3 px-3.5 rounded-[6px] bg-white flex justify-between items-center"
              )}
            >
              {dateRange.startDate || dateRange.endDate
                ? `${dateRange.startDate ? dayjs(dateRange.startDate).format("MMM D") : "Start"} - ${dateRange.endDate ? dayjs(dateRange.endDate).format("MMM D") : "End"}`
                : "All Dates"}
              <Calendar className="h-4 w-4 ml-2" />
            </div>

            {/* Date Picker Dropdown */}
            {datePickerOpen && (
              <div className="absolute top-full right-0 p-5 z-50 rounded-md border bg-white shadow-lg">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-muted-foreground">From Date</label>
                    <Input
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) =>
                        setDateRange({ ...dateRange, startDate: e.target.value })
                      }
                      className="w-[200px] h-10"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-muted-foreground">To Date</label>
                    <Input
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) =>
                        setDateRange({ ...dateRange, endDate: e.target.value })
                      }
                      className="w-[200px] h-10"
                    />
                  </div>
                  {(dateRange.startDate || dateRange.endDate) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDateRange({ startDate: "", endDate: "" })}
                      className="w-full"
                    >
                      <X size={16} className="mr-2" />
                      Clear Dates
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
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
          filters?.tagTitle ||
          dateRange.startDate ||
          dateRange.endDate) && (
          <span className="text-[#3E4D61] font-semibold text-sm">
            Active Filters:
          </span>
        )}
        {(dateRange.startDate || dateRange.endDate) && (
          <span className="text-xs text-primary bg-blue-50 rounded-md border border-blue-200 flex gap-1 w-fit p-2">
            {dateRange.startDate && dateRange.endDate
              ? `${dayjs(dateRange.startDate).format("MMM D, YYYY")} - ${dayjs(dateRange.endDate).format("MMM D, YYYY")}`
              : dateRange.startDate
                ? `From ${dayjs(dateRange.startDate).format("MMM D, YYYY")}`
                : `To ${dayjs(dateRange.endDate).format("MMM D, YYYY")}`}
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
          filters?.tagTitle ||
          dateRange.startDate ||
          dateRange.endDate) && (
          <span
            className="font-medium text-sm text-primary underline underline-offset-2 cursor-pointer"
            onClick={() => {
              setSearchFilters(null);
              setDateRange({ startDate: "", endDate: "" });
            }}
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
