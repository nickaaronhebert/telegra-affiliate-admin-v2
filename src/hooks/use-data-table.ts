import * as React from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";

import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
} from "@tanstack/react-table";

import { z } from "zod";
import { useDebounce } from "@/hooks/use-debounce";

export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

export interface DataTableFilterField<TData> {
  label: string;
  value: keyof TData;
  placeholder?: string;
  options?: Option[];
}

interface UseDataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  pageCount: number;
  defaultPerPage?: number;

  filterFields?: DataTableFilterField<TData>[];
  enableAdvancedFilter?: boolean;
}

const schema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().optional(),
  sort: z.string().optional(),
});

export function useDataTable<TData, TValue>({
  data,
  columns,
  pageCount,
  defaultPerPage = 100,

  filterFields = [],
  enableAdvancedFilter = false,
}: UseDataTableProps<TData, TValue>) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const queryParams = schema.parse(Object.fromEntries(searchParams));
  const page = queryParams.page;
  const perPage = queryParams.per_page ?? defaultPerPage;

  const { searchableColumns, filterableColumns } = React.useMemo(
    () => ({
      searchableColumns: filterFields.filter((field) => !field.options),
      filterableColumns: filterFields.filter((field) => field.options),
    }),
    [filterFields]
  );

  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(location.search);
      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }
      return newSearchParams.toString();
    },
    [location.search]
  );

  const initialColumnFilters: ColumnFiltersState = React.useMemo(() => {
    return Array.from(searchParams.entries()).reduce<ColumnFiltersState>(
      (filters, [key, value]) => {
        const faceted = filterableColumns.find((col) => col.value === key);
        const searchable = searchableColumns.find((col) => col.value === key);
        if (faceted) {
          filters.push({ id: key, value: value.split(".") });
        } else if (searchable) {
          filters.push({ id: key, value: [value] });
        }
        return filters;
      },
      []
    );
  }, [filterableColumns, searchableColumns, searchParams]);

  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>(initialColumnFilters);

  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: page - 1,
      pageSize: perPage,
    });

  const pagination = React.useMemo(
    () => ({ pageIndex, pageSize }),
    [pageIndex, pageSize]
  );

  React.useEffect(() => {
    const query = createQueryString({
      page: pageIndex + 1,
      per_page: pageSize,
    });

    navigate(`${location.pathname}?${query}`, { replace: true });
  }, [pageIndex, pageSize, createQueryString, location.pathname, navigate]);

  const debouncedSearchableFilters = JSON.parse(
    useDebounce(
      JSON.stringify(
        columnFilters.filter((filter) =>
          searchableColumns.find((col) => col.value === filter.id)
        )
      ),
      500
    )
  ) as ColumnFiltersState;

  const facetedFilters = columnFilters.filter((filter) =>
    filterableColumns.find((col) => col.value === filter.id)
  );

  const [mounted, setMounted] = React.useState(false);


  React.useEffect(() => {
    if (enableAdvancedFilter) return;

    if (!mounted) {
      setMounted(true);
      return;
    }

    const newParams: Record<string, string | number | null> = { page: 1 };

    for (const filter of debouncedSearchableFilters) {
      if (typeof filter.value === "string") {
        newParams[filter.id] = filter.value;
      } else {
        newParams[filter.id] = null;
      }

    }

    // for (const column of filterableColumnFilters) {
    //   if (typeof column.value === "object" && Array.isArray(column.value)) {
    //     Object.assign(newParamsObject, { [column.id]: column.value.join(".") });
    //   }
    // }

    for (const filter of facetedFilters) {
      // console.log("?????????", filter);
      // console.log("typeof", typeof filter.value);
      if (typeof filter.value === "object" && Array.isArray(filter.value)) {
        Object.assign(newParams, { [filter.id]: filter.value.join(".") });
      }
      // if (typeof filter.value === "string") {
      //   newParams[filter.id] = filter.value;
      // } else {
      //   newParams[filter.id] = null;
      // }
      // newParams[filter.id] = Array.isArray(filter.value)
      //   ? filter.value.join(".")
      //   : null;
    }

    // Clean removed filters
    for (const key of searchParams.keys()) {
      const isSearchable = searchableColumns.find((col) => col.value === key);
      const isFilterable = filterableColumns.find((col) => col.value === key);
      const notInState = !columnFilters.find((filter) => filter.id === key);

      if ((isSearchable || isFilterable) && notInState) {
        newParams[key] = null;
      }
    }
    // console.log("filres", newParams);
    navigate(`${location.pathname}?${createQueryString(newParams)}`, {
      replace: true,
    });
    table.setPageIndex(0);
  }, [
    JSON.stringify(debouncedSearchableFilters),
    JSON.stringify(facetedFilters),
  ]);

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      pagination,
      columnFilters,
    },
    enableRowSelection: true,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,

    manualFiltering: true,
  });

  return { table };
}
