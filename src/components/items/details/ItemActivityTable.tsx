import Card from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/shared/EmptyState";
import { History } from "lucide-react";
import type { Transaction } from "@/lib/transactions";

type ItemActivityTableProps = {
  transactions: Transaction[];
  isLoading?: boolean;
};

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
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function typeLabel(transaction: Transaction) {
  const raw = transaction.transaction_type ?? transaction.reason ?? "";
  const normalized = String(raw).trim().toLowerCase();

  if (normalized.includes("out")) return "Stock out";
  if (normalized.includes("in")) return "Stock in";

  switch (normalized) {
    case "received stock":
      return "Stock in";
    case "sold":
      return "Stock out";
    case "damaged":
      return "Adjustment";
    case "audit correction":
      return "Audit correction";
    default:
      return normalized ? normalized : "—";
  }
}

export default function ItemActivityTable({
  transactions,
  isLoading = false,
}: ItemActivityTableProps) {
  if (isLoading && !transactions.length) {
    return (
      <Card className="rounded-[12px] border-border p-0 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="border-b border-border px-6 py-4">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            Recent activity
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Loading the latest transactions for this item…
          </p>
        </div>

        <div className="space-y-3 px-6 py-5">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </Card>
    );
  }

  if (!transactions.length) {
    return (
      <EmptyState
        icon={History}
        title="No recent movement"
        description="This item has no transaction history yet. Stock changes will appear here once the item is moved or sold."
      />
    );
  }

  return (
    <Card className="rounded-[12px] border-border p-0 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="border-b border-border px-6 py-4">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          Recent activity
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          The latest movements for this SKU pulled from the transaction stream.
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead>Transaction</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>User</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => {
            const positive = transaction.quantity_change > 0;
            const timestamp = transaction.created_at ?? transaction.timestamp;
            const userLabel =
              transaction.operator_name ??
              transaction.Opratore_name ??
              transaction.user_id ??
              "—";
            return (
              <TableRow key={transaction.id}>
                <TableCell className="font-mono text-xs font-semibold text-primary">
                  {transaction.id}
                </TableCell>
                <TableCell>{formatDate(timestamp)}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      positive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-700"
                    }
                  >
                    {typeLabel(transaction)}
                  </Badge>
                </TableCell>
                <TableCell
                  className={
                    positive
                      ? "font-semibold text-emerald-700"
                      : "font-semibold text-rose-700"
                  }
                >
                  {positive ? "+" : ""}
                  {transaction.quantity_change}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {userLabel}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
