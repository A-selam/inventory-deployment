"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import { useWarehousesList } from "@/hooks/useWarehouses";
import type { Warehouse } from "@/lib/warehouses";

import CreateWarehouseModal from "./CreateWarehouseModal";
import WarehouseFilters from "./WarehouseFilters";
import WarehouseHeader from "./WarehouseHeader";
import WarehouseStatsCards from "./WarehouseStatsCards";
import WarehousesTable from "./WarehousesTable";
import {
  buildWarehousesHref,
  parseWarehouseSortBy,
  parseWarehouseSortDir,
  sortWarehouses,
  type WarehouseSortBy,
  type WarehouseSortDir,
} from "./warehouses-utils";

function filterWarehouses(warehouses: Warehouse[], search: string) {
  const query = search.trim().toLowerCase();
  if (!query) return warehouses;

  return warehouses.filter((warehouse) => {
    const haystack = [
      warehouse.name,
      warehouse.location ?? "",
      warehouse.description ?? "",
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  });
}

function WarehousesErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <Card className="rounded-[12px] border-border bg-card p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="label-caps">Warehouses unavailable</div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {message}
          </p>
        </div>
        <Button type="button" className="h-11 gap-2 px-4" onClick={onRetry}>
          <RefreshCw className="size-4" />
          Retry
        </Button>
      </div>
    </Card>
  );
}

export default function WarehousesPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const search = searchParams.get("search") ?? "";
  const sortBy = parseWarehouseSortBy(searchParams.get("sort_by"));
  const sortDir = parseWarehouseSortDir(searchParams.get("sort_dir"));

  useEffect(() => {
    const normalizedSortBy = searchParams.get("sort_by");
    const normalizedSortDir = searchParams.get("sort_dir");

    if (normalizedSortBy === sortBy && normalizedSortDir === sortDir) {
      return;
    }

    router.replace(
      buildWarehousesHref(searchParams, {
        sort_by: sortBy,
        sort_dir: sortDir,
      }),
    );
  }, [router, searchParams, sortBy, sortDir]);

  const warehousesQuery = useWarehousesList();
  const warehouses = useMemo(
    () => warehousesQuery.data ?? [],
    [warehousesQuery.data],
  );

  const visibleWarehouses = useMemo(() => {
    const filtered = filterWarehouses(warehouses, search);
    return sortWarehouses(filtered, sortBy, sortDir);
  }, [warehouses, search, sortBy, sortDir]);

  const totals = useMemo(() => {
    const totalWarehouses = warehouses.length;
    const totalCapacityConfigured = warehouses.reduce(
      (sum, warehouse) => sum + (warehouse.capacity > 0 ? warehouse.capacity : 0),
      0,
    );
    const totalUsedCapacity = warehouses.reduce(
      (sum, warehouse) => sum + warehouse.used_capacity,
      0,
    );
    const totalAvailableCapacity = warehouses.reduce(
      (sum, warehouse) => sum + warehouse.available_capacity,
      0,
    );

    return {
      totalWarehouses,
      totalCapacityConfigured,
      totalUsedCapacity,
      totalAvailableCapacity,
    };
  }, [warehouses]);

  const updateParams = (updates: Record<string, string | undefined>) => {
    router.replace(buildWarehousesHref(searchParams, updates));
  };

  return (
    <div className="space-y-8">
      <WarehouseHeader onAddWarehouse={() => setIsCreateOpen(true)} />
      <CreateWarehouseModal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} />

      <WarehouseStatsCards
        totalWarehouses={totals.totalWarehouses}
        totalCapacityConfigured={totals.totalCapacityConfigured}
        totalUsedCapacity={totals.totalUsedCapacity}
        totalAvailableCapacity={totals.totalAvailableCapacity}
      />

      <WarehouseFilters
        search={search}
        sortBy={sortBy as WarehouseSortBy}
        sortDir={sortDir as WarehouseSortDir}
        onSearchChange={(value) => updateParams({ search: value || undefined })}
        onSortByChange={(value) => updateParams({ sort_by: value })}
        onSortDirChange={(value) => updateParams({ sort_dir: value })}
        onClear={() => router.push("/warehouses")}
      />

      {warehousesQuery.isError ? (
        <WarehousesErrorState
          message={
            warehousesQuery.error.message ||
            "We could not load warehouses right now."
          }
          onRetry={() => warehousesQuery.refetch()}
        />
      ) : (
        <WarehousesTable
          warehouses={visibleWarehouses}
          isLoading={warehousesQuery.isLoading}
        />
      )}
    </div>
  );
}

