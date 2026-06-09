"use client";

import { ChevronLeft, ChevronRight, Package } from "lucide-react";

import Button from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Transaction } from "@/lib/transactions";

type TransactionRow = Transaction & {
  item?: string;
  item_name?: string;
  sku?: string;
  transaction_type?: string;
  created_at?: string | number;
  timestamp?: string | number;
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

function formatTime(value: string | number | null | undefined) {
  const date = parseDate(value);
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

function normalizeTransactionType(transaction: TransactionRow) {
  const rawType = transaction.transaction_type ?? transaction.reason ?? "";
  const normalized = rawType.trim().toUpperCase();

  if (!normalized) {
    return transaction.quantity_change >= 0 ? "STOCK IN" : "STOCK OUT";
  }

  if (normalized.includes("OUT")) return "STOCK OUT";
  if (normalized.includes("IN")) return "STOCK IN";
  if (normalized === "SOLD" || normalized === "DAMAGED") return "STOCK OUT";
  if (normalized === "RECEIVED STOCK") return "STOCK IN";

  if (normalized === "AUDIT CORRECTION") {
    return transaction.quantity_change >= 0 ? "STOCK IN" : "STOCK OUT";
  }

  return normalized;
}

function getTransactionBadgeClass(transaction: TransactionRow) {
  return normalizeTransactionType(transaction) === "STOCK IN"
    ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border border-rose-200 bg-rose-50 text-rose-700";
}

function getItemName(transaction: TransactionRow) {
  const name = transaction.item_name ?? transaction.item;
  if (typeof name === "string" && name.trim()) return name;

  const fallbackId = transaction.item_id ?? transaction.id;
  return (
    `Item ${fallbackId.slice(0, 8).toUpperCase()}`
  );
}

function getSku(transaction: TransactionRow) {
  if (transaction.sku) return transaction.sku;
  const fallbackId = transaction.item_id ?? transaction.id;
  return `SKU-${fallbackId.slice(0, 8).toUpperCase()}`;
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
  const rows = transactions as TransactionRow[];

  if (isLoading) {
    return (
      <Card className="rounded-[12px] border border-border p-0 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-center p-12">
          <p className="text-muted-foreground">Loading transactions...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="rounded-[12px] border border-border p-0 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="border border-border rounded-md bg-card shadow-sm overflow-hidden">
        <div className="max-h-[70vh] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-background shadow-sm [&_tr]:border-b">
              <TableRow className="border-b transition-colors hover:bg-[#F8FAFC] dark:hover:bg-muted">
                <TableHead className="sticky top-0 z-10 bg-background p-2 whitespace-nowrap text-foreground has-[[role=checkbox]]:pr-0">
                  Date
                </TableHead>
                <TableHead className="sticky top-0 z-10 bg-background p-2 whitespace-nowrap text-foreground has-[[role=checkbox]]:pr-0">
                  Item Description
                </TableHead>
                <TableHead className="sticky top-0 z-10 bg-background p-2 whitespace-nowrap text-foreground has-[[role=checkbox]]:pr-0">
                  Type
                </TableHead>
                <TableHead className="sticky top-0 z-10 bg-background p-2 whitespace-nowrap text-foreground has-[[role=checkbox]]:pr-0">
                  Quantity
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {rows.length === 0 ? (
                <TableRow className="border-b transition-colors hover:bg-[#F8FAFC] dark:hover:bg-muted">
                  <TableCell
                    colSpan={4}
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
                rows.map((transaction) => {
                  const timestamp =
                    transaction.created_at ?? transaction.timestamp;

                  return (
                    <TableRow
                      key={transaction.id}
                      className="border-b transition-colors hover:bg-[#F8FAFC] dark:hover:bg-muted"
                    >
                      <TableCell className="p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0">
                        <div className="text-sm font-medium text-foreground">
                          {formatDate(timestamp)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatTime(timestamp)}
                        </div>
                      </TableCell>
                      <TableCell className="p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0">
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                            <Package className="size-4" />
                          </div>
                          <div className="min-w-0 space-y-0.5">
                            <div className="truncate font-medium text-foreground">
                              {getItemName(transaction)}
                            </div>
                            <div className="truncate text-xs text-muted-foreground">
                              {getSku(transaction)}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0">
                        <Badge
                          className={getTransactionBadgeClass(transaction)}
                        >
                          {normalizeTransactionType(transaction)}
                        </Badge>
                      </TableCell>
                      <TableCell className="p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0">
                        <span className="font-mono text-[13px] tracking-tight text-foreground">
                          {transaction.quantity_change}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
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
    </Card>
  );
}
