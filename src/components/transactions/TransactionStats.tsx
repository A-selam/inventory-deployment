"use client";

import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";

type TransactionStatsProps = {
  totalMovements: number;
  inbound24h: number;
  outbound24h: number;
  anomalies: number;
};

function formatCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function StatCard({
  title,
  value,
  icon: Icon,
  iconClassName,
  valueClassName = "text-foreground",
  borderClassName,
}: {
  title: string;
  value: string;
  icon: LucideIcon;
  iconClassName: string;
  valueClassName?: string;
  borderClassName?: string;
}) {
  return (
    <Card
      className={`rounded-[12px] border border-border p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${borderClassName ?? ""}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="label-caps">{title}</div>
          <div
            className={`text-3xl font-bold tracking-tight ${valueClassName}`}
          >
            {value}
          </div>
        </div>

        <div
          className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
        >
          <Icon className="size-5" />
        </div>
      </div>
    </Card>
  );
}

export default function TransactionStats({
  totalMovements,
  inbound24h,
  outbound24h,
  anomalies,
}: TransactionStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <StatCard
        title="Total Movements"
        value={formatCount(totalMovements)}
        icon={TrendingUp}
        iconClassName="bg-slate-100 text-slate-700"
      />

      <StatCard
        title="Inbound (24h)"
        value={formatCount(inbound24h)}
        icon={ArrowDownRight}
        iconClassName="bg-slate-100 text-slate-700"
      />

      <StatCard
        title="Outbound (24h)"
        value={formatCount(outbound24h)}
        icon={ArrowUpRight}
        iconClassName="bg-slate-100 text-slate-700"
      />

      <StatCard
        title="Anomalies"
        value={formatCount(anomalies)}
        icon={AlertCircle}
        iconClassName="bg-red-50 text-destructive"
        valueClassName="text-destructive"
        borderClassName="border-l-4 border-l-destructive"
      />
    </div>
  );
}
