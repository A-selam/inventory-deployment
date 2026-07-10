"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import Card from "@/components/ui/card";

type WarehousePiePoint = {
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
        <div className="text-muted-foreground">Total Qty</div>
        <div className="font-semibold text-foreground">
          <CurrencyQty value={value} />
        </div>
      </div>
    </div>
  );
}

export default function WarehouseQtyPieChart({
  data,
}: {
  data: WarehousePiePoint[];
}) {
  const safeData = (data ?? [])
    .filter((d) => Number.isFinite(d.value))
    .map((d) => ({ ...d, value: Math.max(0, d.value) }));

  const colors = ["#0f172a", "#c6c6cd", "#22c55e", "#f59e0b", "#ef4444"];

  return (
    <Card className="rounded-[12px] p-3 border-border shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="label-caps font-bold text-2xl mb-0">
            Items by Warehouse
          </div>
        </div>
      </div>

      <div className="mt-2 h-55 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={safeData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={44}
              outerRadius={79}
              paddingAngle={3}
              labelLine={false}
              label={({ name, percent }) => {
                // Show only for larger slices
                if (percent == null) return null;
                if (percent < 0.12) return null;
                return `${name}`;
              }}
            >
              {safeData.map((_, idx) => (
                <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
