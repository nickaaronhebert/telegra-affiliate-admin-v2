import type { ColumnDef } from "@tanstack/react-table";
import type { ProductVariationItem } from "@/types/responses/productVariationsList";

export function productVariationsColumns(): ColumnDef<ProductVariationItem>[] {
  return [
    {
      id: "product",
      header: "Product",
      accessorFn: (row) => row.product?.title,
      cell: ({ getValue }) => (
        <span className="text-xs font-medium text-gray-900">
          {(getValue() as string) || "No Product"}
        </span>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "variation",
      header: "Variation",
      accessorFn: (row) => row.description,
      cell: ({ getValue }) => (
        <span className="text-xs text-gray-700">
          {getValue() as string}
        </span>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ getValue }) => (
        <span className="text-xs font-medium text-gray-600">
          {getValue() as string}
        </span>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];
}
