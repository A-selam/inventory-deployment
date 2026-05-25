import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import Card from "@/components/ui/card";
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

export default function StockChart({
  data,
}: {
  data: StockMovementChartPoint[];
}) {
  return (
    <Card className="rounded-[12px] border-border shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="label-caps font-bold text-2xl mb-0">
            Stock Movement Trends
          </div>
          <p className="text-sm text-muted-foreground">
            Monthly inbound and outbound stock movement.
          </p>
        </div>

        <ChartLegend />
      </div>

      <div className="mt-6 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap={20}>
            <CartesianGrid
              vertical={false}
              stroke="#e5e7eb"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <YAxis hide />
            <Bar
              dataKey="stock_in"
              fill="#0f172a"
              radius={[8, 8, 0, 0]}
              maxBarSize={26}
            />
            <Bar
              dataKey="stock_out"
              fill="#c6c6cd"
              radius={[8, 8, 0, 0]}
              maxBarSize={26}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
