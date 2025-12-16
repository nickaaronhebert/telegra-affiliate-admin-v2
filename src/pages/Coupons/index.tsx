import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Button } from "@/components/ui/button";
import {
  useDataTable,
  type DataTableFilterField,
} from "@/hooks/use-data-table";
import { useViewAllCouponsQuery } from "@/redux/services/coupon";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import {
  organizationCouponColumns,
  type CouponDetails,
} from "@/components/data-table/columns/coupon";
import { useMemo } from "react";
import { ROUTES } from "@/constants/routes";

export default function Coupons() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("per_page") ?? "10", 10);
  const code = searchParams.get("code") ?? "";

  const { data, isLoading, isFetching } = useViewAllCouponsQuery({
    page,
    perPage,
    ...(code && { code }),
  });

  const columns = useMemo(() => organizationCouponColumns(), []);

  const filterFields: DataTableFilterField<CouponDetails>[] = [
    {
      label: "Code",
      value: "code",
      placeholder: "Search by coupon code",
    },
  ];

  const { table } = useDataTable({
    data: !(isLoading || isFetching) ? data?.result || [] : [],
    columns: columns,
    filterFields,
    pageCount: Math.ceil((data?.count || 0) / perPage),
  });

  return (
    <>
      <div className="lg:p-3.5">
        <div className="flex justify-between items-center w-full">
          <div>
            <h1 className="text-2xl font-bold">Coupons</h1>
          </div>

          <div className="flex gap-5 items-center">
            <DataTableToolbar
              table={table}
              filterFields={filterFields}
              className="mb-2"
            />
            <Button
              className="px-[20px] py-[5px] min-h-[40px] cursor-pointer rounded-[50px] bg-primary text-white font-semibold leading-[16px]"
              onClick={() => navigate(ROUTES.COUPONS_CREATE)}
            >
              <Plus /> Add Coupon
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-3.5 bg-white shadow-[0px_2px_40px_0px_#00000014] pb-[12px]">
        <DataTable table={table} isLoading={isLoading} />
        <DataTablePagination table={table} />
      </div>
    </>
  );
}
