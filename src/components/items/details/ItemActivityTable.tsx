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
import EmptyState from "@/components/shared/EmptyState";
import { History } from "lucide-react";
import type { Transaction } from "@/lib/transactions";

type ItemActivityTableProps = {
  transactions: Transaction[];
};

function formatDate(timestamp: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

function typeLabel(reason: Transaction["reason"]) {
  switch (reason) {
    case "received stock":
      return "Stock in";
    case "sold":
      return "Stock out";
    case "damaged":
      return "Adjustment";
    default:
      return "Audit correction";
  }
}

export default function ItemActivityTable({
  transactions,
}: ItemActivityTableProps) {
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
            return (
              <TableRow key={transaction.id}>
                <TableCell className="font-mono text-xs font-semibold text-primary">
                  {transaction.id}
                </TableCell>
                <TableCell>{formatDate(transaction.timestamp)}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      positive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-700"
                    }
                  >
                    {typeLabel(transaction.reason)}
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
                  {transaction.user_id}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
