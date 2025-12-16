import { useMemo } from "react";
import { DataTable } from "@/components/data-table/data-table";
import {
  useDataTable,
  type DataTableFilterField,
} from "@/hooks/use-data-table";
import type { PatientDetail, PatientOrder } from "@/types/responses/patient";
import { type ColumnDef } from "@tanstack/react-table";
import TransactionSvg from "@/assets/icons/Transactions";
import { PAYMENT_MECHANISMS } from "@/constants";
import dayjs from "dayjs";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";

interface TransactionProps {
  patient: PatientDetail;
}

const Transaction = ({ patient }: TransactionProps) => {
  const transactions = useMemo(() => {
    return patient?.orders
      ?.map((item) => {
        if (item.consultationPaymentIntent) {
          const key = item?.consultationPaymentIntent.id;
          const fullId = item?.consultationPaymentIntent?.id;
          const id = item?.consultationPaymentIntent?.id?.substring(
            item?.consultationPaymentIntent?.id?.length - 6
          );
          let billing = "";

          if (
            item?.project?.paymentStrategy?.paymentMechanism ===
            PAYMENT_MECHANISMS.AffiliatePay
          ) {
            billing = "Affiliate";
          } else if (
            item?.project?.paymentStrategy?.paymentMechanism ===
            PAYMENT_MECHANISMS.PatientPay
          ) {
            billing = "Patient";
          }

          const amount = `$${item.consultationPaymentIntent?.amount} `;
          const status = item.consultationPaymentIntent?.status;
          const date = dayjs(item.consultationPaymentIntent?.createdAt).format(
            "MMMM DD, YYYY, h:mm A"
          );
          const products = item?.productVariations?.map(
            (item: any) => item?.productVariation?.description
          );
          const finalProducts = products.join(", ");
          return {
            key,
            fullId,
            id,
            status,
            date,
            amount,
            billing,
            finalProducts,
          };
        }
      })
      .filter((x) => x);
  }, [patient?.orders]);

  const columns = useMemo<ColumnDef<PatientOrder>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => (
          <div className="text-sm text-gray-900">
            {row.getValue("id")?.toString().slice(-6)}
          </div>
        ),
      },

      {
        accessorKey: "finalProducts",
        header: "Products",
        cell: ({ row }) => (
          <div className="text-sm text-gray-900 text-wrap">
            {row.getValue("finalProducts")}
          </div>
        ),
      },
      {
        accessorKey: "billing",
        header: "Billing",
        cell: ({ row }) => (
          <div className="text-sm text-gray-900">{row.getValue("billing")}</div>
        ),
      },
      {
        accessorKey: "amount",
        header: "Cost",
        cell: ({ row }) => (
          <div className="text-sm text-gray-900">{row.getValue("amount")}</div>
        ),
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => {
          return <p className="text-xs font-medium">{row.getValue("date")}</p>;
        },
      },
    ],
    []
  );

  const filterFields: DataTableFilterField<PatientOrder>[] = [
    {
      label: "status",
      value: "status",
      placeholder: "Search orders...",
    },
  ];

  const { table } = useDataTable({
    data: (transactions || []) as any[],
    columns,
    filterFields,
    pageCount: 1,
  });

  return (
    <div
      id="transactionsInformation"
      className="bg-white rounded-[10px] shadow-[0px_2px_40px_0px_#00000014] p-6 mb-2.5"
    >
      <div className="flex gap-2 items-center border-b border-card-border justify-between align-middle pb-2">
        <div className="flex gap-2 items-center">
          <TransactionSvg color="#000000" width={18} height={18} />
          <h1 className="text-base font-bold ">Transactions</h1>
        </div>
      </div>
      <div className="mt-3">
        <div
          className={`bg-white shadow-[0px_2px_40px_0px_#00000014] pb-[12px] overflow-y-auto rounded-lg ${
            patient?.orders?.length > 0 ? "h-[350px]" : "h-[200px]"
          }`}
        >
          <DataTable
            table={table}
            scrollClass={true}
            className="min-w-[220px]"
          />
        </div>
        {patient?.orders?.length > 1 && <DataTablePagination table={table} />}
      </div>
    </div>
  );
};
export default Transaction;
