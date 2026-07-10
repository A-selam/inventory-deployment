"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import { useWarehousesList } from "@/hooks/useWarehouses";

import CreateWarehouseModal from "./CreateWarehouseModal";
import WarehouseFilters from "./WarehouseFilters";
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

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

function parsePositiveInt(value: string | null, fallback: number) {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
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
  const [filtersOpen, setFiltersOpen] = useState(false);

  const page = parsePositiveInt(searchParams.get("page"), DEFAULT_PAGE);
  const limit = parsePositiveInt(searchParams.get("limit"), DEFAULT_LIMIT);
  const sortBy = parseWarehouseSortBy(searchParams.get("sort_by"));
  const sortDir = parseWarehouseSortDir(searchParams.get("sort_dir"));

  useEffect(() => {
    const normalizedPage = searchParams.get("page");
    const normalizedLimit = searchParams.get("limit");
    const normalizedSortBy = searchParams.get("sort_by");
    const normalizedSortDir = searchParams.get("sort_dir");

    if (
      normalizedPage === String(page) &&
      normalizedLimit === String(limit) &&
      normalizedSortBy === sortBy &&
      normalizedSortDir === sortDir
    ) {
      return;
    }

    router.replace(
      buildWarehousesHref(searchParams, {
        page,
        limit,
        sort_by: sortBy,
        sort_dir: sortDir,
      }),
    );
  }, [limit, page, router, searchParams, sortBy, sortDir]);

  const warehousesQuery = useWarehousesList({ page, limit });
  const warehousesData = warehousesQuery.data?.data;
  const warehouses = useMemo(() => warehousesData?.data ?? [], [warehousesData]);

  const visibleWarehouses = useMemo(
    () => sortWarehouses(warehouses, sortBy, sortDir),
    [warehouses, sortBy, sortDir],
  );

  const totalWarehouses = warehousesData?.total ?? 0;
  const totalPages =
    warehousesData?.total_pages ??
    Math.max(1, Math.ceil(totalWarehouses / Math.max(1, limit)));
  const currentPage = Math.min(page, Math.max(totalPages, 1));

  const updateParams = (updates: Record<string, string | number | undefined>) => {
    router.replace(buildWarehousesHref(searchParams, updates));
  };

  const replaceWithResetPage = (
    updates: Record<string, string | number | undefined>,
  ) => {
    updateParams({ ...updates, page: DEFAULT_PAGE, limit });
  };

  const updatePage = (nextPage: number) => {
    updateParams({ page: nextPage, limit, sort_by: sortBy, sort_dir: sortDir });
  };

  return (
    <div className="space-y-8">
      <CreateWarehouseModal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} />

      {/* <WarehouseStatsCards totalWarehouses={totalWarehouses} /> */}

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
          page={currentPage}
          totalPages={totalPages}
          limit={limit}
          totalWarehouses={totalWarehouses}
          title="List of warehouses"
          filtersOpen={filtersOpen}
          onToggleFilters={() => setFiltersOpen((prev) => !prev)}
          filters={
            <WarehouseFilters
              sortBy={sortBy as WarehouseSortBy}
              sortDir={sortDir as WarehouseSortDir}
              limit={limit}
              onSortByChange={(value) => replaceWithResetPage({ sort_by: value })}
              onSortDirChange={(value) =>
                replaceWithResetPage({ sort_dir: value })
              }
              onLimitChange={(value) => updateParams({ limit: value })}
              onClear={() => router.push("/warehouses")}
            />
          }
          onAddWarehouse={() => setIsCreateOpen(true)}
          onPageChange={updatePage}
        />
      )}
    </div>
  );
}

