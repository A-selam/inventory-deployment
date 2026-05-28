"use client";

import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Transaction, TransactionReason } from "@/lib/transactions";

const reasonStyles: Record<TransactionReason, { bg: string; text: string }> = {
  "received stock": { bg: "bg-green-100", text: "text-green-800" },
  sold: { bg: "bg-blue-100", text: "text-blue-800" },
  damaged: { bg: "bg-red-100", text: "text-red-800" },
  "audit correction": { bg: "bg-amber-100", text: "text-amber-800" },
};

const getReasonLabel = (reason: TransactionReason): string => {
  return reason.charAt(0).toUpperCase() + reason.slice(1);
};

const formatDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

type TransactionTableProps = {
  transactions: Transaction[];
  isLoading?: boolean;
};

export default function TransactionTable({
  transactions,
  isLoading = false,
}: TransactionTableProps) {
  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <div className="flex items-center justify-center p-12">
          <p className="text-muted-foreground">Loading transactions...</p>
        </div>
      </Card>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card className="overflow-hidden">
        <div className="flex flex-col items-center justify-center p-12">
          <p className="text-muted-foreground">No transactions found</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border bg-muted hover:bg-muted">
              <TableHead className="text-xs font-semibold uppercase tracking-wide">
                Transaction ID
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide">
                Timestamp
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide">
                Item &amp; SKU
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide">
                Reason
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide">
                Change
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide">
                Operator
              </TableHead>
              <TableHead className="w-12 text-right text-xs font-semibold uppercase tracking-wide" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => {
              const styles = reasonStyles[transaction.reason];
              const isPositive = transaction.quantity_change > 0;

              return (
                <TableRow key={transaction.id} className="group hover:bg-muted/50">
                  <TableCell className="font-mono text-xs font-semibold text-primary">
                    #{transaction.id.slice(0, 8).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium text-foreground">
                      {formatDate(transaction.timestamp)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatTime(transaction.timestamp)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-foreground">Item Name</div>
                    <div className="font-mono text-xs text-muted-foreground">
                      SKU-{transaction.item_id}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles.bg} ${styles.text}`}
                    >
                      {getReasonLabel(transaction.reason)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`font-mono text-base font-bold ${
                        isPositive ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {isPositive ? "+" : ""}{transaction.quantity_change}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex size-6 items-center justify-center rounded-full bg-primary-foreground font-semibold text-primary">
                        <span className="text-xs font-bold">U</span>
                      </div>
                      <span className="text-sm">User Name</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label="More options"
                    >
                      <MoreVertical className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
