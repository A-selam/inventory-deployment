"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import Button from "@/components/ui/button";
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

const defaultReasonStyles = {
  bg: "bg-slate-100",
  text: "text-slate-700",
};

const getReasonLabel = (reason: string): string => {
  if (!reason) return "Unknown";

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
  page?: number;
  totalPages?: number;
  limit?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
};

function PaginationButton({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={disabled}
      className="h-9 gap-2 px-3"
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

export default function TransactionTable({
  transactions,
  isLoading = false,
  page = 1,
  totalPages = 1,
  limit = 20,
  totalItems = 0,
  onPageChange,
}: TransactionTableProps) {
  if (isLoading) {
    return (
      <Card className="rounded-[12px] border border-border p-0 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-center p-12">
          <p className="text-muted-foreground">Loading transactions...</p>
        </div>
      </Card>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card className="rounded-[12px] border border-border p-0 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col items-center justify-center p-12">
          <p className="text-muted-foreground">No transactions found</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="rounded-[12px] border border-border p-0 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="overflow-hidden rounded-md bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-background shadow-sm [&_tr]:border-b">
              <TableRow className="border-b transition-colors hover:bg-[#F8FAFC] dark:hover:bg-muted">
                <TableHead className="sticky top-0 z-10 bg-background p-2 whitespace-nowrap text-foreground has-[[role=checkbox]]:pr-0">
                  Transaction ID
                </TableHead>
                <TableHead className="sticky top-0 z-10 bg-background p-2 whitespace-nowrap text-foreground has-[[role=checkbox]]:pr-0">
                  Timestamp
                </TableHead>
                <TableHead className="sticky top-0 z-10 bg-background p-2 whitespace-nowrap text-foreground has-[[role=checkbox]]:pr-0">
                  Item &amp; SKU
                </TableHead>
                <TableHead className="sticky top-0 z-10 bg-background p-2 whitespace-nowrap text-foreground has-[[role=checkbox]]:pr-0">
                  Reason
                </TableHead>
                <TableHead className="sticky top-0 z-10 bg-background p-2 whitespace-nowrap text-foreground has-[[role=checkbox]]:pr-0">
                  Change
                </TableHead>
                <TableHead className="sticky top-0 z-10 bg-background p-2 whitespace-nowrap text-foreground has-[[role=checkbox]]:pr-0">
                  Operator
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => {
                const styles =
                  reasonStyles[transaction.reason as TransactionReason] ??
                  defaultReasonStyles;
                const isPositive = transaction.quantity_change > 0;
                const reasonLabel = getReasonLabel(transaction.reason);

                return (
                  <TableRow
                    key={transaction.id}
                    className="border-b transition-colors hover:bg-[#F8FAFC] dark:hover:bg-muted"
                  >
                    <TableCell className="p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0 font-mono text-xs font-semibold text-primary">
                      #{transaction.id.slice(0, 8).toUpperCase()}
                    </TableCell>
                    <TableCell className="p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0">
                      <div className="text-sm font-medium text-foreground">
                        {formatDate(transaction.timestamp)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTime(transaction.timestamp)}
                      </div>
                    </TableCell>
                    <TableCell className="p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0">
                      <div className="font-semibold text-foreground">
                        Item Name
                      </div>
                      <div className="font-mono text-xs text-muted-foreground">
                        SKU-{transaction.item_id}
                      </div>
                    </TableCell>
                    <TableCell className="p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles.bg} ${styles.text}`}
                      >
                        {reasonLabel}
                      </span>
                    </TableCell>
                    <TableCell className="p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0">
                      <span
                        className={`font-mono text-base font-bold ${
                          isPositive ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {isPositive ? "+" : ""}
                        {transaction.quantity_change}
                      </span>
                    </TableCell>
                    <TableCell className="p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0">
                      <div className="flex items-center gap-2">
                        <div className="flex size-6 items-center justify-center rounded-full bg-primary-foreground font-semibold text-primary">
                          <span className="text-xs font-bold">U</span>
                        </div>
                        <span className="text-sm">User Name</span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-3 border-t border-border bg-background px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing page {page} of {totalPages} • {totalItems} total items •{" "}
            {limit} per page
          </p>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <PaginationButton
              disabled={page <= 1}
              onClick={() => onPageChange?.(page - 1)}
            >
              <ChevronLeft className="size-4" />
              Previous
            </PaginationButton>

            <PaginationButton
              disabled={page >= totalPages}
              onClick={() => onPageChange?.(page + 1)}
            >
              Next
              <ChevronRight className="size-4" />
            </PaginationButton>
          </div>
        </div>
      </div>
    </Card>
  );
}
