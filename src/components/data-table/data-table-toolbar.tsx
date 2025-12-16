import * as React from "react";
import type { Table } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
// import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
// import { DataTableFilterField } from "@/hooks/use-data-table";
import type { DataTableFilterField } from "@/hooks/use-data-table";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

interface DataTableToolbarProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>;
  filterFields?: DataTableFilterField<TData>[];
  searchIcon?: React.ReactNode;
  inputClassName?: string;
  facetedClassName?: string;
}

export function DataTableToolbar<TData>({
  table,
  filterFields = [],
  children,
  className,
  searchIcon,
  inputClassName = "",
  facetedClassName = "",
  ...props
}: DataTableToolbarProps<TData>) {
  // Memoize computation of searchableColumns and filterableColumns
  const { searchableColumns, filterableColumns } = React.useMemo(() => {
    return {
      searchableColumns: filterFields.filter((field) => !field.options),
      filterableColumns: filterFields.filter((field) => field.options),
    };
  }, [filterFields]);

  return (
    <div
      className={cn(
        "flex items-center justify-end space-x-2 overflow-auto p-1",
        className
      )}
      {...props}
    >
      <div className="flex flex-1 items-center space-x-2">
        {searchableColumns.length > 0 &&
          searchableColumns.map(
            (column) =>
              table.getColumn(column.value ? String(column.value) : "") && (
                <div key={String(column.value)} className="relative">
                  <Input
                    autoComplete={String(column.value)}
                    name={String(column.value)}
                    key={String(column.value)}
                    placeholder={column.placeholder}
                    value={
                      (table
                        .getColumn(String(column.value))
                        ?.getFilterValue() as string) ?? ""
                    }
                    onChange={(event) =>
                      table
                        .getColumn(String(column.value))
                        ?.setFilterValue(event.target.value)
                    }
                    className={cn("h-12 w-40 lg:w-96 bg-white", inputClassName)}
                  />
                  {searchIcon && (
                    <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                      {searchIcon}
                    </span>
                  )}
                </div>
              )
          )}
        {filterableColumns.length > 0 &&
          filterableColumns.map(
            (column) =>
              table.getColumn(column.value ? String(column.value) : "") && (
                <DataTableFacetedFilter
                  facetedClassName={facetedClassName}
                  key={String(column.value)}
                  column={table.getColumn(
                    column.value ? String(column.value) : ""
                  )}
                  title={column.label}
                  options={column.options ?? []}
                />
              )
          )}
        {/* {isFiltered && (
          <Button
            aria-label="Reset filters"
            // variant="ghost"
            className="h-8 px-2 lg:px-3"
            onClick={() => table.resetColumnFilters(true)}
          >
            Reset
            <X className="ml-2 size-4" aria-hidden="true" />
          </Button>
        )} */}
      </div>
    </div>
  );
}
