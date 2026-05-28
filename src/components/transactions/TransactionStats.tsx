"use client";

import { AlertCircle, ArrowDownRight, ArrowUpRight, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

type TransactionStatsProps = {
  totalMovements: number;
  inbound24h: number;
  outbound24h: number;
  anomalies: number;
};

export default function TransactionStats({
  totalMovements,
  inbound24h,
  outbound24h,
  anomalies,
}: TransactionStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      {/* Total Movements */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Total Movements
          </span>
          <TrendingUp className="size-5 text-primary" />
        </div>
        <p className="mb-3 text-3xl font-bold text-foreground">{totalMovements.toLocaleString()}</p>
        <p className="flex items-center gap-1 text-sm text-green-700">
          <ArrowUpRight className="size-4" />
          +8.4% from last month
        </p>
      </Card>

      {/* Inbound 24h */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Inbound (24h)
          </span>
          <ArrowDownRight className="size-5 text-primary" />
        </div>
        <p className="mb-3 text-3xl font-bold text-foreground">{inbound24h.toLocaleString()}</p>
        <p className="text-sm text-muted-foreground">Received from 12 vendors</p>
      </Card>

      {/* Outbound 24h */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Outbound (24h)
          </span>
          <ArrowUpRight className="size-5 text-primary" />
        </div>
        <p className="mb-3 text-3xl font-bold text-foreground">{outbound24h.toLocaleString()}</p>
        <p className="text-sm text-muted-foreground">Sold through 3 channels</p>
      </Card>

      {/* Anomalies */}
      <Card className="border-l-4 border-l-destructive p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-destructive">
            Anomalies
          </span>
          <AlertCircle className="size-5 text-destructive" />
        </div>
        <p className="mb-3 text-3xl font-bold text-destructive">{anomalies}</p>
        <p className="text-sm font-semibold text-destructive">Needs immediate audit</p>
      </Card>
    </div>
  );
}
