"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import Card from "@/components/ui/card";

type CategoryPiePoint = {
  name: string;
  value: number;
};

function CurrencyQty({ value }: { value: number }) {
  return new Intl.NumberFormat("en-US").format(value);
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number }>;
}) {
  if (!active || !payload || payload.length === 0) return null;

  const item = payload[0];
  const name = item.name ?? "";
  const value = item.value ?? 0;

  return (
    <div className="rounded-md border border-border bg-card px-3 py-2 text-xs shadow-[0_8px_30px_rgba(15,23,42,0.12)]">
      <div className="mb-1 font-semibold text-foreground">{name}</div>
      <div className="flex items-center justify-between gap-6">
        <div className="text-muted-foreground">Items</div>
        <div className="font-semibold text-foreground">
          <CurrencyQty value={value} />
        </div>
      </div>
    </div>
  );
}

export default function CategoryQtyPieChart({
  data,
  totalItems = 0,
}: {
  data: CategoryPiePoint[];
  totalItems?: number;
}) {
  const safeData = (data ?? [])
    .filter((d) => Number.isFinite(d.value))
    .map((d) => ({ ...d, value: Math.max(0, d.value) }))
    .filter((d) => d.name && d.value > 0);

  const colors = ["#0f172a", "#c6c6cd", "#22c55e", "#f59e0b", "#ef4444"];

  return (
    <Card className="rounded-[12px] p-3 border-border shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="label-caps mb-0 text-2xl font-bold">
            Items by Category
          </div>
          {/* <p className="text-sm text-muted-foreground">
            {totalItems > 0
              ? `${new Intl.NumberFormat("en-US").format(totalItems)} total items across categories`
              : "Category item totals"}
          </p> */}
        </div>
      </div>

      <div className="mt-2 h-50 w-full">
        {safeData.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
            No category totals available yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={safeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={80}
                paddingAngle={3}
                labelLine={false}
                label={({ name, percent }) => {
                  if (percent == null || percent < 0.12) return null;
                  return `${name}`;
                }}
              >
                {safeData.map((_, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={colors[idx % colors.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
