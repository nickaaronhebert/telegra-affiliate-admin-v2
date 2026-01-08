import {
  type OrderDetails,
  organizationOrderColumns,
} from "@/components/data-table/columns/order";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Button } from "@/components/ui/button";
import {
  useDataTable,
  type DataTableFilterField,
} from "@/hooks/use-data-table";
import { useViewAllOrdersQuery } from "@/redux/services/order";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { ECOMMERCE_ORDER_STATUS } from "@/types/global/ecommerceOrderStatus";
import { useAppDispatch } from "@/redux/store";
import { resetOrder } from "@/redux/slices/create-order";

export default function Order() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("per_page") ?? "10", 10);
  const orderId = searchParams.get("ecommerceOrderId") ?? "";
  const status = searchParams.get("status") ?? "";
  const { data, isLoading } = useViewAllOrdersQuery({
    page,
    perPage,
    orderid: orderId,
    status: status,
  });

  const columns = useMemo(() => organizationOrderColumns(), []);

  const filterFields: DataTableFilterField<OrderDetails>[] = [
    {
      label: "Order ID",
      value: "ecommerceOrderId",
      placeholder: "Search By Order ID",
    },
    {
      label: "All Statuses",
      value: "status",
      options: [
        {
          label: "On Hold",
          value: ECOMMERCE_ORDER_STATUS.ON_HOLD,
        },
        {
          label: "Pending",
          value: ECOMMERCE_ORDER_STATUS.PENDING,
        },
        {
          label: "Canceled",
          value: ECOMMERCE_ORDER_STATUS.CANCELED,
        },
        {
          label: "Completed",
          value: ECOMMERCE_ORDER_STATUS.COMPLETED,
        },
        {
          label: "Failed",
          value: ECOMMERCE_ORDER_STATUS.FAILED,
        },
        {
          label: "Draft",
          value: ECOMMERCE_ORDER_STATUS.DRAFT,
        },
      ],
    },
  ];

  const { table } = useDataTable({
    data: data?.result || [],
    columns: columns,
    filterFields,
    pageCount: Math.ceil((data?.count || 0) / perPage),
  });

  return (
    <div className="w-full min-w-0">
      <div className="lg:p-3.5">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center w-full gap-4">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold"> Commerce Orders</h1>
          </div>

          <div className="flex  gap-3  items-center">
            <div className="flex gap-2">
              <DataTableToolbar
                table={table}
                filterFields={filterFields}
                facetedClassName={"border-border min-h-11 max-h-12"}
                inputClassName="border-border min-h-11"
                className="mb-2"
              />
            </div>
            <Button
              className="px-5 py-[5px] min-h-11 hover:bg-primary-foreground cursor-pointer rounded-[50px] bg-primary text-white font-semibold text-[12px] leading-[16px] whitespace-nowrap flex-shrink-0"
              onClick={() => {
                dispatch(resetOrder());
                navigate("/orders/create");
              }}
            >
              Create Commerce Order
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-3.5 bg-white shadow-[0px_2px_40px_0px_#00000014] pb-[12px] overflow-hidden">
        <DataTable table={table} isLoading={isLoading} />
        <DataTablePagination table={table} totalRows={data?.count} />
      </div>
    </div>
  );
}
