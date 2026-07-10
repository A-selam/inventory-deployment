import { Building2, FolderKanban, Layers3 } from "lucide-react";

import Card from "@/components/ui/card";

type CategoryStatsProps = {
  totalCategories: number;
  totalVendors: number;
  assignedCategories: number;
};

const statCards = [
  {
    label: "Total categories",
    key: "totalCategories",
    icon: FolderKanban,
    helper: "Inventory classifications",
  },
  {
    label: "Vendor coverage",
    key: "totalVendors",
    icon: Building2,
    helper: "Vendors across categories",
  },
  {
    label: "Assigned categories",
    key: "assignedCategories",
    icon: Layers3,
    helper: "Categories with vendors",
  },
] as const;

export default function CategoryStats({
  totalCategories,
  totalVendors,
  assignedCategories,
}: CategoryStatsProps) {
  const values = { totalCategories, totalVendors, assignedCategories };

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-3">
      {statCards.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.key}
            className="rounded-[12px] border-border bg-card p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="label-caps">{stat.label}</div>
                <div className="mt-3 text-2xl font-bold tracking-tight text-foreground">
                  {values[stat.key].toLocaleString()}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {stat.helper}
                </p>
              </div>
              <div className="flex size-6 items-center justify-center rounded-[12px] bg-muted text-foreground">
                <Icon className="size-4" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
