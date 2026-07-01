"use client";

import { useMemo } from "react";
import { RefreshCw, Warehouse } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategoriesList } from "@/hooks/useCategories";
import { useReplenishment } from "@/hooks/useReplenishment";

import ReplenishmentFilters from "./ReplenishmentFilters";
import ReplenishmentStats from "./ReplenishmentStats";
import ReplenishmentVendorGroup from "./ReplenishmentVendorGroup";
import { formatCompactCount } from "./replenishment-utils";

function ReplenishmentLoadingState() {
  return (
    <div className="space-y-6">
      <Card className="rounded-[12px] border-border bg-card p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="space-y-3 rounded-[12px] border border-border p-5"
            >
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-4 w-40" />
            </div>
          ))}
        </div>
      </Card>

      <Card className="rounded-[12px] border-border bg-card p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_240px]">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>
      </Card>

      {Array.from({ length: 2 }).map((_, vendorIndex) => (
        <Card
          key={vendorIndex}
          className="overflow-hidden rounded-[12px] border-border bg-card p-0 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
        >
          <div className="flex items-center justify-between border-b border-border bg-muted/30 px-5 py-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-11 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-3 w-56" />
              </div>
            </div>
            <Skeleton className="h-12 w-32" />
          </div>
          <div className="space-y-3 p-5">
            {Array.from({ length: 3 }).map((_, rowIndex) => (
              <Skeleton key={rowIndex} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

function ReplenishmentErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <Card className="rounded-[12px] border-border bg-card p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="label-caps">Replenishment unavailable</div>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
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

function ReplenishmentEmptyState() {
  return (
    <Card className="rounded-[12px] border-border bg-card p-10 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl border border-border bg-muted text-muted-foreground">
          <Warehouse className="size-6" />
        </div>
        <h2 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
          No replenishment items found
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Try widening your search or selecting a different category.
        </p>
      </div>
    </Card>
  );
}

function buildQueryHref(
  current: Pick<URLSearchParams, "toString">,
  updates: Record<string, string | undefined>,
) {
  const params = new URLSearchParams(current.toString());

  Object.entries(updates).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
  });

  return params.toString();
}

export default function ReplenishmentPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";

  const replenishmentQuery = useReplenishment({
    search: search || undefined,
    category: category || undefined,
  });

  const categoriesQuery = useCategoriesList();
  const categories = categoriesQuery.data ?? [];
  const data = replenishmentQuery.data?.data;

  const hasFilters = Boolean(search || category);
  const vendorEntries = useMemo(
    () => Object.entries(data?.items_grouped_by_vendor ?? {}),
    [data],
  );

  const handleSearchChange = (value: string) => {
    const query = buildQueryHref(searchParams, {
      search: value || undefined,
      category: category || undefined,
    });

    router.replace(query ? `/replenishment?${query}` : "/replenishment");
  };

  const handleCategoryChange = (value: string) => {
    const query = buildQueryHref(searchParams, {
      search: search || undefined,
      category: value || undefined,
    });

    router.replace(query ? `/replenishment?${query}` : "/replenishment");
  };

  const handleClearFilters = () => {
    router.replace("/replenishment");
  };

  return (
    <div className="space-y-8">
      {replenishmentQuery.isLoading ? (
        <ReplenishmentLoadingState />
      ) : replenishmentQuery.isError ? (
        <ReplenishmentErrorState
          message={
            replenishmentQuery.error.message ||
            "We could not load replenishment data right now."
          }
          onRetry={() => replenishmentQuery.refetch()}
        />
      ) : data ? (
        <div className="space-y-6">
          {/* <ReplenishmentStats
            totalReorderValue={data.total_reorder_value}
            outOfStock={data.out_of_stock}
            pendingOrder={data.pending_order}
            criticalLowStock={data.critical_low_stock}
          /> */}

          {/* <ReplenishmentFilters
            search={search}
            category={category}
            categories={categories}
            isCategoriesLoading={categoriesQuery.isLoading}
            onSearchChange={handleSearchChange}
            onCategoryChange={handleCategoryChange}
            onClear={handleClearFilters}
          /> */}

          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  Items by vendor
                </h2>
                <p className="text-sm text-muted-foreground">
                  {formatCompactCount(vendorEntries.length)} vendor group
                  {vendorEntries.length === 1 ? "" : "s"} loaded
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                {hasFilters
                  ? "Filtered results"
                  : "Showing all low stock items"}
              </div>
            </div>

            {vendorEntries.length === 0 ? (
              <ReplenishmentEmptyState />
            ) : (
              <div className="space-y-6">
                {vendorEntries.map(([vendorName, items]) => (
                  <ReplenishmentVendorGroup
                    key={vendorName}
                    vendorName={vendorName}
                    items={items}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      ) : (
        <ReplenishmentEmptyState />
      )}
    </div>
  );
}
