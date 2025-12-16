import * as React from "react";
import { flexRender, type Table as TanstackTable } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import NoData from "@/assets/icons/NoData";
// import { DataTablePagination } from "./data-table-pagination";
// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface DataTableProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The table instance returned from useDataTable hook with pagination, sorting, filtering, etc.
   * @type TanstackTable<TData>
   */
  table: TanstackTable<TData>;

  /**
   * The floating bar to render at the bottom of the table on row selection.
   * @default null
   * @type React.ReactNode | null
   * @example floatingBar={<TasksTableFloatingBar table={table} />}
   */
  floatingBar?: React.ReactNode | null;
  showPagination?: boolean;
  headerClass?: boolean;
  scrollClass?: boolean;
  isLoading?: boolean;
}

export function DataTable<TData>({
  table,
  isLoading = false,
  // floatingBar = null,
  // children,
  className,
  // showPagination,
  headerClass = false,
  scrollClass = false,
}: // ...props
DataTableProps<TData>) {
  return (
    <>
      {/* // ? below div and scroll area is commented */}
      {/* <ScrollArea className="h-[75vh] rounded-none border w-full overflow-x-auto"> */}
      <ScrollArea
        className={cn(
          "w-full",
          !scrollClass
            ? "h-[calc(100vh-280px)] min-h-[400px] max-h-[620px] rounded-md"
            : ""
        )}
      >
        <Table className={cn("w-full min-w-[1000px]", className)}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-lavender  ">
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "text-black font-medium text-sm h-10",
                        index === 0 && headerClass ? "rounded-tl-2xl" : "",
                        index === headerGroup?.headers?.length - 1 &&
                          headerClass
                          ? "rounded-tr-2xl"
                          : ""
                      )}
                      // className="text-black font-medium text-sm h-10 "
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="bg-background">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-3 text-sm">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className={
                    scrollClass
                      ? "h-[auto] text-center"
                      : "h-[66vh] text-center"
                  }
                >
                  {isLoading ? (
                    <div
                      className={`flex flex-col h-full items-center justify-center ${
                        scrollClass && "my-3"
                      }`}
                    >
                      <div className=" rounded-full flex items-center justify-center mb-2 animate-spin">
                        <svg
                          className="w-8 h-8 text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-lg font-medium">Almost there!</p>
                        <p className="text-sm text-muted-foreground">
                          We're retrieving your records...
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`flex flex-col items-center justify-center h-full gap-2 ${
                        scrollClass && "my-3"
                      }`}
                    >
                      <NoData />
                      <p className="text-lg font-medium">No matching records</p>
                      <p className="text-sm text-muted-foreground">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  );
}
