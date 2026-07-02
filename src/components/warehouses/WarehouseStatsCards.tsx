import { Warehouse as WarehouseIcon } from "lucide-react";

import Card from "@/components/ui/card";

type WarehouseStatsCardsProps = {
  totalWarehouses: number;
};

const statCards = [
  {
    label: "Total warehouses",
    key: "totalWarehouses",
    icon: WarehouseIcon,
    helper: "Active storage locations",
  },
] as const;

export default function WarehouseStatsCards({
  totalWarehouses,
}: WarehouseStatsCardsProps) {
  const values = {
    totalWarehouses,
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.key}
            className="rounded-[12px] border-border bg-card p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="label-caps">{stat.label}</div>
                <div className="mt-3 text-3xl font-bold tracking-tight text-foreground">
                  {values[stat.key].toLocaleString()}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {stat.helper}
                </p>
              </div>
              <div className="flex size-11 items-center justify-center rounded-[12px] bg-muted text-foreground">
                <Icon className="size-5" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

