"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import { useMemo, useState } from "react";
import { useTransactionsRange } from "@/hooks/useTransactions";
import type { Transaction } from "@/lib/transactions";
import type { StockMovementChartPoint } from "@/types/dashboard";

function ChartLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground">
      <div className="flex items-center gap-2">
        <span className="size-2.5 rounded-full bg-[#0f172a]" />
        <span>Stock In</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="size-2.5 rounded-full bg-[#c6c6cd]" />
        <span>Stock Out</span>
      </div>
    </div>
  );
}

type ChartMode = "week" | "month" | "year";

type ChartPoint = {
  label: string;
  stock_in: number;
  stock_out: number;
};

function formatDateYmd(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfWeekMonday(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = (day + 6) % 7;
  d.setDate(d.getDate() - diff);
  return d;
}

function endOfMonth(date: Date) {
  const d = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  d.setHours(0, 0, 0, 0);
  return d;
}

function parseTransactionDate(transaction: Transaction) {
  const raw = transaction.created_at ?? transaction.timestamp;

  if (typeof raw === "string") {
    const trimmed = raw.trim();
    const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const year = Number(match[1]);
      const month = Number(match[2]);
      const day = Number(match[3]);
      if (
        Number.isFinite(year) &&
        Number.isFinite(month) &&
        Number.isFinite(day)
      ) {
        return new Date(year, month - 1, day);
      }
    }

    const parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.getTime())) return parsed;
    return null;
  }

  if (typeof raw === "number") {
    const parsed = new Date(raw);
    if (!Number.isNaN(parsed.getTime())) return parsed;
    return null;
  }

  return null;
}

function inferMovementDirection(transaction: Transaction): "in" | "out" {
  const rawType = (transaction.transaction_type ?? transaction.reason ?? "")
    .trim()
    .toUpperCase();

  if (rawType.includes("OUT")) return "out";
  if (rawType.includes("IN")) return "in";
  if (rawType === "SOLD" || rawType === "DAMAGED") return "out";
  if (rawType === "RECEIVED STOCK") return "in";

  return transaction.quantity_change >= 0 ? "in" : "out";
}

function toShortMonthLabel(monthIndex: number) {
  return new Intl.DateTimeFormat("en-US", { month: "short" }).format(
    new Date(2000, monthIndex, 1),
  );
}

function monthIndexFromLabel(label: string) {
  const trimmed = label.trim();
  if (!trimmed) return null;

  const numeric = Number(trimmed);
  if (Number.isFinite(numeric) && numeric >= 1 && numeric <= 12)
    return numeric - 1;

  const parsed = new Date(`${trimmed} 1, 2000`);
  if (!Number.isNaN(parsed.getTime())) return parsed.getMonth();

  return null;
}

function normalizeYearData(points: StockMovementChartPoint[]): ChartPoint[] {
  const map = new Map<number, { stock_in: number; stock_out: number }>();
  let mappedCount = 0;

  for (const point of points) {
    const index = monthIndexFromLabel(point.month);
    if (index === null) continue;

    map.set(index, {
      stock_in: Number.isFinite(point.stock_in) ? point.stock_in : 0,
      stock_out: Number.isFinite(point.stock_out) ? point.stock_out : 0,
    });
    mappedCount += 1;
  }

  if (mappedCount === 0) {
    return points.map((point) => ({
      label: point.month,
      stock_in: Number.isFinite(point.stock_in) ? point.stock_in : 0,
      stock_out: Number.isFinite(point.stock_out) ? point.stock_out : 0,
    }));
  }

  return Array.from({ length: 12 }).map((_, index) => {
    const entry = map.get(index);
    return {
      label: toShortMonthLabel(index),
      stock_in: entry?.stock_in ?? 0,
      stock_out: entry?.stock_out ?? 0,
    };
  });
}

function CustomTooltip({
  active,
  label,
  payload,
}: {
  active?: boolean;
  label?: string;
  payload?: Array<{ name?: string; value?: number; dataKey?: string | number }>;
}) {
  if (!active || !payload || payload.length === 0) return null;

  const inbound =
    payload.find((item) => item.dataKey === "stock_in")?.value ?? 0;
  const outbound =
    payload.find((item) => item.dataKey === "stock_out")?.value ?? 0;

  return (
    <div className="rounded-md border border-border bg-card px-3 py-2 text-xs shadow-[0_8px_30px_rgba(15,23,42,0.12)]">
      <div className="mb-2 font-semibold text-foreground">{label}</div>
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="size-2.5 rounded-full bg-[#0f172a]" />
          <span>Stock In</span>
        </div>
        <div className="font-semibold text-foreground">
          {new Intl.NumberFormat("en-US").format(inbound)}
        </div>
      </div>
      <div className="mt-1 flex items-center justify-between gap-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="size-2.5 rounded-full bg-[#c6c6cd]" />
          <span>Stock Out</span>
        </div>
        <div className="font-semibold text-foreground">
          {new Intl.NumberFormat("en-US").format(outbound)}
        </div>
      </div>
    </div>
  );
}

export default function StockChart({
  yearlyData,
}: {
  yearlyData: StockMovementChartPoint[];
}) {
  const [mode, setMode] = useState<ChartMode>("year");

  const range = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (mode === "week") {
      const start = startOfWeekMonday(now);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);

      return { start, end };
    }

    if (mode === "month") {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      start.setHours(0, 0, 0, 0);
      const end = endOfMonth(now);

      return { start, end };
    }

    return null;
  }, [mode]);

  const transactionsParams = useMemo(() => {
    if (!range) return null;

    return {
      start_date: formatDateYmd(range.start),
      end_date: formatDateYmd(range.end),
    };
  }, [range]);

  const transactionsQuery = useTransactionsRange(
    transactionsParams,
    mode !== "year" && Boolean(transactionsParams),
  );

  const chartData = useMemo<ChartPoint[]>(() => {
    if (mode === "year") {
      return normalizeYearData(yearlyData);
    }

    if (!range) return [];

    const transactions = transactionsQuery.data ?? [];

    if (mode === "week") {
      const bucketMap = new Map<
        string,
        { stock_in: number; stock_out: number }
      >();
      for (let offset = 0; offset < 7; offset += 1) {
        const d = new Date(range.start);
        d.setDate(range.start.getDate() + offset);
        bucketMap.set(formatDateYmd(d), { stock_in: 0, stock_out: 0 });
      }

      for (const tx of transactions) {
        const date = parseTransactionDate(tx);
        if (!date) continue;
        const key = formatDateYmd(date);
        const bucket = bucketMap.get(key);
        if (!bucket) continue;

        const direction = inferMovementDirection(tx);
        const amount = Math.abs(
          Number.isFinite(tx.quantity_change) ? tx.quantity_change : 0,
        );
        if (direction === "in") bucket.stock_in += amount;
        else bucket.stock_out += amount;
      }

      const formatter = new Intl.DateTimeFormat("en-US", { weekday: "short" });

      return Array.from(bucketMap.entries()).map(([key, value]) => {
        const [y, m, d] = key.split("-").map(Number);
        const date = new Date(y, m - 1, d);
        return {
          label: formatter.format(date),
          stock_in: value.stock_in,
          stock_out: value.stock_out,
        };
      });
    }

    const daysInMonth = new Date(
      range.start.getFullYear(),
      range.start.getMonth() + 1,
      0,
    ).getDate();
    const weekCount = Math.ceil(daysInMonth / 7);

    const weeks: Array<{ stock_in: number; stock_out: number }> = Array.from(
      { length: weekCount },
      () => ({ stock_in: 0, stock_out: 0 }),
    );

    for (const tx of transactions) {
      const date = parseTransactionDate(tx);
      if (!date) continue;
      if (
        date.getFullYear() !== range.start.getFullYear() ||
        date.getMonth() !== range.start.getMonth()
      ) {
        continue;
      }

      const weekIndex = Math.floor((date.getDate() - 1) / 7);
      const bucket = weeks[weekIndex];
      if (!bucket) continue;

      const direction = inferMovementDirection(tx);
      const amount = Math.abs(
        Number.isFinite(tx.quantity_change) ? tx.quantity_change : 0,
      );
      if (direction === "in") bucket.stock_in += amount;
      else bucket.stock_out += amount;
    }

    return weeks.map((bucket, index) => ({
      label: `Week ${index + 1}`,
      stock_in: bucket.stock_in,
      stock_out: bucket.stock_out,
    }));
  }, [mode, range, transactionsQuery.data, yearlyData]);

  return (
    <Card className="rounded-[12px] border-border shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-2">
        <div className="label-caps font-bold text-2xl mb-0">
          Stock Movement Trends
        </div>
      </div>

      <div className="flex flex-col items-end gap-3">
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button
            type="button"
            size="sm"
            variant={mode === "week" ? "default" : "outline"}
            onClick={() => setMode("week")}
          >
            This week
          </Button>
          <Button
            type="button"
            size="sm"
            variant={mode === "month" ? "default" : "outline"}
            onClick={() => setMode("month")}
          >
            This month
          </Button>
          <Button
            type="button"
            size="sm"
            variant={mode === "year" ? "default" : "outline"}
            onClick={() => setMode("year")}
          >
            This year
          </Button>
        </div>
        <ChartLegend />
      </div>
    </div>

    <div className="mt-6 h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} barCategoryGap={20} margin={{ left: -10, right: 10 }}>
          <CartesianGrid
            vertical={false}
            stroke="#e5e7eb"
            strokeDasharray="3 3"
          />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#3b414a", fontSize: 12 }}
          />
          
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 12 }}
            width={40} 
            />
          <Tooltip content={<CustomTooltip />} cursor={{  fill: "rgba(15, 23, 42, 0.08)" }} />
           
          <Bar
            dataKey="stock_in"
            fill="#090a0a"
            radius={[8, 8, 0, 0]}
            maxBarSize={26}
            activeBar={{ fill: "#1e293b" }} 
          />
          <Bar
            dataKey="stock_out"
            fill="#afafc6"
            radius={[8, 8, 0, 0]}
            maxBarSize={26}
            activeBar={{ fill: "#818a97" }} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
</Card>

  );
}
