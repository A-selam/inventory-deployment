import { createColumnHelper } from "@tanstack/react-table";
import { Package } from "lucide-react";

import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
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
  return (
    // <section className="space-y-4 bg-card">
    <Card className="rounded-[12px] p-0 border-border shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="p-6">
        <div className="label-caps font-bold text-2xl mb-0">
          Recent Transactions
        </div>
      </div>

      <DataTable columns={columns} data={transactions} />
    </Card>
    // </section>
  );
}
