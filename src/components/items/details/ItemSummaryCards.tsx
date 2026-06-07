import {
  AlertTriangle,
  BadgeDollarSign,
  Package,
  Warehouse,
} from "lucide-react";

import Card from "@/components/ui/card";
import type { ItemDetail } from "@/types/items";

type ItemSummaryCardsProps = {
  item: ItemDetail;
};

function currency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function MetricCard({
  title,
  value,
  note,
  icon: Icon,
  accentClassName,
}: {
  title: string;
  value: string;
  note: string;
  icon: typeof Package;
  accentClassName: string;
}) {
  return (
    <Card className="rounded-[12px] border-border p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="label-caps">{title}</div>
          <div className="text-3xl font-bold tracking-tight text-foreground">
            {value}
          </div>
          <div className="text-sm text-muted-foreground">{note}</div>
        </div>
        <div
          className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${accentClassName}`}
        >
          <Icon className="size-5" />
        </div>
      </div>
    </Card>
  );
}

export default function ItemSummaryCards({ item }: ItemSummaryCardsProps) {
  const quantity = item.stock ?? 0;
  const minimum = item.minimum_stock_level ?? 0;
  const stockValue = item.selling_price * quantity;
  const reorderGap = quantity - minimum;

  const quantityNote =
    quantity <= 0
      ? "Out of stock"
      : quantity <= minimum
        ? "Below minimum threshold"
        : "Healthy inventory position";

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        title="Stock on hand"
        value={new Intl.NumberFormat("en-US").format(quantity)}
        note={quantityNote}
        icon={Package}
        accentClassName="bg-slate-100 text-slate-700"
      />
      <MetricCard
        title="Reorder threshold"
        value={new Intl.NumberFormat("en-US").format(minimum)}
        note={
          reorderGap >= 0
            ? `${reorderGap} units above threshold`
            : `${Math.abs(reorderGap)} units below threshold`
        }
        icon={AlertTriangle}
        accentClassName="bg-orange-50 text-orange-600"
      />
      <MetricCard
        title="Stock value"
        value={currency(stockValue)}
        note={`Selling price ${currency(item.selling_price)} per unit`}
        icon={BadgeDollarSign}
        accentClassName="bg-slate-100 text-slate-700"
      />
      <MetricCard
        title="Storage"
        value={item.Bin_location || "Unknown"}
        note={item.category || "No category assigned"}
        icon={Warehouse}
        accentClassName="bg-slate-100 text-slate-700"
      />
    </section>
  );
}
