import { AlertTriangle, Clock3, PackageX, ReceiptText } from "lucide-react";

import Card from "@/components/ui/card";
import { formatCurrency, formatCompactCount } from "./replenishment-utils";

type ReplenishmentStatsProps = {
  totalReorderValue: number;
  outOfStock: number;
  pendingOrder: number;
  criticalLowStock: number;
};

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
}) {
  return (
    <Card className="rounded-[12px] border-border bg-card p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="label-caps">{label}</div>
          <div className="text-3xl font-semibold tracking-tight text-foreground">
            {value}
          </div>
          <p className="text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        <div
          className={`flex size-11 shrink-0 items-center justify-center rounded-xl border ${tone}`}
        >
          <Icon className="size-5" />
        </div>
      </div>
    </Card>
  );
}

export default function ReplenishmentStats({
  totalReorderValue,
  outOfStock,
  pendingOrder,
  criticalLowStock,
}: ReplenishmentStatsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total reorder value"
        value={formatCurrency(totalReorderValue)}
        description="Projected cost to restore low-stock items to target levels."
        icon={ReceiptText}
        tone="border-slate-200 bg-slate-50 text-slate-700"
      />
      <StatCard
        label="Out of stock"
        value={formatCompactCount(outOfStock)}
        description="Items that need immediate replenishment attention."
        icon={PackageX}
        tone="border-rose-200 bg-rose-50 text-rose-700"
      />
      <StatCard
        label="Pending orders"
        value={formatCompactCount(pendingOrder)}
        description="Reorders already in progress with vendors."
        icon={Clock3}
        tone="border-amber-200 bg-amber-50 text-amber-700"
      />
      <StatCard
        label="Critical low stock"
        value={formatCompactCount(criticalLowStock)}
        description="SKUs below a critical threshold and trending to zero."
        icon={AlertTriangle}
        tone="border-rose-200 bg-rose-50 text-rose-700"
      />
    </section>
  );
}
