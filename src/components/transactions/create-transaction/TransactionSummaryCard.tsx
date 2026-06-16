"use client";

import { cn } from "@/lib/utils";

type TransactionSummaryCardProps = {
  currentStock: number;
  netChange: number;
  newBalance: number;
  status: "ready" | "invalid";
};

function formatSigned(value: number) {
  if (value === 0) return "—";
  return value > 0 ? `+${value}` : String(value);
}

export default function TransactionSummaryCard({
  currentStock,
  netChange,
  newBalance,
  status,
}: TransactionSummaryCardProps) {
  const showPlaceholder = status === "invalid" && netChange === 0;
  const changeClassName = showPlaceholder
    ? "text-rose-700"
    : netChange === 0
      ? "text-muted-foreground"
      : netChange > 0
        ? "text-emerald-700"
        : "text-rose-700";

  return (
    <div className="rounded-[14px] border border-border bg-muted/20 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="label-caps text-foreground">Transaction Summary</p>
          <p className="text-sm text-muted-foreground">
            Verify details before committing.
          </p>
        </div>
        <span
          className={cn(
            "rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]",
            status === "ready"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-rose-50 text-rose-700",
          )}
        >
          {status === "ready" ? "Ready" : "Invalid"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="label-caps text-muted-foreground">Current Stock</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
            {currentStock}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="label-caps text-muted-foreground">Net Change</p>
          <p
            className={cn(
              "mt-1 text-2xl font-semibold tabular-nums",
              changeClassName,
            )}
          >
            {showPlaceholder ? "—" : formatSigned(netChange)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="label-caps text-muted-foreground">New Balance</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
            {showPlaceholder ? "—" : newBalance}
          </p>
        </div>
      </div>
    </div>
  );
}
