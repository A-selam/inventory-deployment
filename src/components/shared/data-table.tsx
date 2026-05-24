"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
};

const LOADING_ROW_COUNT = 4;

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  // TanStack Table returns runtime helpers that the React Compiler cannot safely memoize.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const leafColumns = table.getVisibleLeafColumns();
  const columnCount = leafColumns.length > 0 ? leafColumns.length : columns.length;
  const safeColumnCount = columnCount > 0 ? columnCount : 1;

  return (
    <div className="border border-border rounded-md bg-card shadow-sm overflow-hidden">
      <div className="max-h-[70vh] overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <TableHeader className="sticky top-0 z-10 bg-background shadow-sm [&_tr]:border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b transition-colors hover:bg-[#F8FAFC] dark:hover:bg-muted"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="sticky top-0 z-10 bg-background p-2 shadow-sm whitespace-nowrap text-foreground has-[[role=checkbox]]:pr-0"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: LOADING_ROW_COUNT }).map((_, rowIndex) => (
                <TableRow
                  key={`loading-${rowIndex}`}
                  className="border-b transition-colors hover:bg-[#F8FAFC] dark:hover:bg-muted"
                >
                  {Array.from({ length: safeColumnCount }).map((__, cellIndex) => (
                    <TableCell
                      key={`loading-${rowIndex}-${cellIndex}`}
                      className="p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0"
                    >
                      <div className="h-3.5 w-full animate-pulse rounded bg-muted/70" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow className="border-b transition-colors hover:bg-[#F8FAFC] dark:hover:bg-muted">
                <TableCell
                  colSpan={safeColumnCount}
                  className="p-6 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0"
                >
                  <div className="flex min-h-32 flex-col items-center justify-center rounded-md border border-dashed border-border bg-muted/20 px-6 py-10 text-center">
                    <p className="text-sm font-medium text-foreground">
                      No results found.
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Try adjusting filters or search terms.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b transition-colors hover:bg-[#F8FAFC] dark:hover:bg-muted data-[state=selected]:bg-muted"
                >
                  {row.getVisibleCells().map((cell) => {
                    const isNumeric = cell.column.columnDef.meta?.isNumeric;

                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          "p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0",
                          isNumeric && "font-mono text-[13px] tracking-tight",
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </table>
      </div>
    </div>
  );
}
