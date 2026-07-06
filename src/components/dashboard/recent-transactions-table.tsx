import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Package } from "lucide-react";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { RecentTransaction } from "@/types/dashboard";
import Card from "@/components/ui/card";

const columnHelper = createColumnHelper<RecentTransaction>();

function parseDate(value: string | number | null | undefined) {
  if (value === null || value === undefined) return null;

  if (typeof value === "number") {
    const ms = value < 1_000_000_000_000 ? value * 1000 : value;
    const date = new Date(ms);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const trimmed = value.trim();
  if (!trimmed) return null;

  if (/^\d+$/.test(trimmed)) {
    const numeric = Number(trimmed);
    if (!Number.isNaN(numeric)) {
      const ms = numeric < 1_000_000_000_000 ? numeric * 1000 : numeric;
      const date = new Date(ms);
      return Number.isNaN(date.getTime()) ? null : date;
    }
  }

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDate(value: string | number | null | undefined) {
  const date = parseDate(value);
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

function normalizeTransactionType(transactionType?: string | null) {
  if (!transactionType) return "UNKNOWN";

  const value = transactionType.toUpperCase();

  if (value.includes("OUT")) return "STOCK OUT";
  if (value.includes("IN")) return "STOCK IN";

  return value;
}

const columns = [
  columnHelper.accessor("created_at", {
    header: "Date",
    cell: ({ getValue }) => (
      <span className="text-sm text-muted-foreground">
        {formatDate(getValue())}
      </span>
    ),
  }),
  columnHelper.accessor("item", {
    header: "Item Description",
    cell: ({ row }) => {
      const transaction = row.original;
      const itemName = transaction.item_name ?? transaction.item;

      return (
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            <Package className="size-4" />
          </div>
          <div className="min-w-0 space-y-0.5">
            <div className="truncate font-medium text-foreground">
              {itemName}
            </div>
            <div className="truncate text-xs text-muted-foreground">
              {transaction.sku}
            </div>
          </div>
        </div>
      );
    },
  }),
  columnHelper.accessor("transaction_type", {
    header: "Type",
    cell: ({ getValue }) => {
      const type = normalizeTransactionType(getValue());
      const isInbound = type === "STOCK IN";

      return (
        <Badge
          className={
            isInbound
              ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border border-rose-200 bg-rose-50 text-rose-700"
          }
        >
          {type}
        </Badge>
      );
    },
  }),
  columnHelper.accessor((row) => String(row.quantity_change), {
    id: "quantity_change",
    header: "Quantity",
    meta: { isNumeric: true },
    cell: ({ getValue }) => {
      const quantity = getValue();
      return <span>{quantity}</span>;
    },
  }),
];

export default function RecentTransactionsTable({
  transactions,
}: {
  transactions: RecentTransaction[];
}) {
  const table = useReactTable({
    data: transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const leafColumns = table.getVisibleLeafColumns();
  const columnCount =
    leafColumns.length > 0 ? leafColumns.length : columns.length;
  const safeColumnCount = columnCount > 0 ? columnCount : 1;

  return (
    <Card className="rounded-[12px] p-0 border-border shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="p-6">
        <div className="label-caps font-bold text-2xl mb-0">
          Recent Transactions
        </div>
      </div>

      {/* <div className="border border-border rounded-md bg-card shadow-sm overflow-hidden">
        <div className="max-h-[70vh] overflow-auto">
          <Table>
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
              {transactions.length === 0 ? (
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
          </Table>
        </div>
      </div> */}
    </Card>
  );
}
