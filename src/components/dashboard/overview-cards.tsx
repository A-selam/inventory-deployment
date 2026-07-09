import { AlertTriangle, Boxes, Landmark, Users } from "lucide-react";

import type { DashboardData } from "@/types/dashboard";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function StatCard({
  title,
  value,
  icon: Icon,
  iconClassName,
  borderClassName,
}: {
  title: string;
  value: string;
  icon: typeof Boxes;
  iconClassName: string;
  borderClassName?: string;
}) {
  return (
    <article
      className={`rounded-[12px] border border-border bg-card p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${borderClassName ?? ""}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="label-caps">{title}</div>
          <div className="text-3xl font-bold tracking-tight text-foreground">
            {value}
          </div>
        </div>

        <div
          className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
        >
          <Icon className="size-5" />
        </div>
      </div>
    </article>
  );
}

export default function OverviewCards({ data }: { data: DashboardData }) {
  return (
    
      <section className="grid gap-3 sm:grid-cols-4 xl:grid-cols-4  2xl:grid-cols-4 py-0.1 mb-4 px-0.1">
        <StatCard
          title="Total Items"
          value={new Intl.NumberFormat("en-US").format(data.total_items)}
          icon={Boxes}
          iconClassName="bg-slate-100 text-slate-700"
        />

        <StatCard
          title="Low Stock Alert"
          value={new Intl.NumberFormat("en-US").format(data.low_stock)}
          icon={AlertTriangle}
          iconClassName="bg-orange-50 text-orange-600"
          borderClassName="border-l-4 border-l-orange-600"
        />

        <StatCard
          title="Inventory Value"
          value={formatCurrency(data.inventory_value)}
          icon={Landmark}
          iconClassName="bg-slate-100 text-slate-700"
        />

        <StatCard
          title="Active Vendors"
          value={new Intl.NumberFormat("en-US").format(data.active_vendors)}
          icon={Users}
          iconClassName="bg-slate-100 text-slate-700"
        />
      </section>
     
  );
}
