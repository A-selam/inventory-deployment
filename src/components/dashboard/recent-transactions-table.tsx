import { createColumnHelper } from "@tanstack/react-table";
import { Package } from "lucide-react";

import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import type { RecentTransaction } from "@/types/dashboard";

const columnHelper = createColumnHelper<RecentTransaction>();

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function normalizeTransactionType(transactionType: string) {
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
    <section className="space-y-4">
      <div>
        <div className="label-caps">Recent Transactions</div>
        <p className="mt-2 text-sm text-muted-foreground">
          Latest stock activity across the warehouse network.
        </p>
      </div>

      <DataTable columns={columns} data={transactions} />
    </section>
  );
}
