"use client";

import { useQuery } from "@tanstack/react-query";

import { getTotalItemsPerWarehouse } from "@/lib/dashboard-warehouses";

import Card from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import WarehouseQtyPieChart from "./warehouse-qty-pie-chart";

export default function DashboardWarehousePieWrapper({
  enabled,
}: {
  enabled: boolean;
}) {
  const query = useQuery({
    queryKey: ["dashboard", "total-items-per-warehouse"],
    queryFn: getTotalItemsPerWarehouse,
    enabled,
  });

  if (!enabled) return null;

  if (query.isLoading) {
    return (
      <Card className="rounded-[12px] border-border shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="space-y-4 p-6">
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-48 w-full" />
        </div>
      </Card>
    );
  }

  if (query.isError) {
    // Keep dashboard usable even if this pie chart fails
    return null;
  }

  const raw = query.data?.data ?? [];

  const chartData = raw
    .map((x) => ({ name: x.warehouse, value: x.qty }))
    .filter((x) => x.name && Number.isFinite(x.value));

  return <WarehouseQtyPieChart data={chartData} />;
}

