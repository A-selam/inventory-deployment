"use client";

import { useQuery } from "@tanstack/react-query";

import Card from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategoryItemTotals } from "@/lib/dashboard-categories";

import CategoryQtyPieChart from "./category-qty-pie-chart";

export default function CategoryPieWrapper({
  enabled,
}: {
  enabled: boolean;
}) {
  const query = useQuery({
    queryKey: ["dashboard", "categories", "total-items"],
    queryFn: getCategoryItemTotals,
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
    return null;
  }

  return (
    <CategoryQtyPieChart
      data={query.data?.data ?? []}
      totalItems={query.data?.totalItems ?? 0}
    />
  );
}
