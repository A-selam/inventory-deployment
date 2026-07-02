"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import { useCategoriesList } from "@/hooks/useCategories";
import type {
  Category,
  CategorySortBy,
  CategorySortDir,
} from "@/lib/categories";

import CategoryFilters from "./CategoryFilters";
import CategoryStats from "./CategoryStats";
import CategoryTable from "./CategoryTable";
import CreateCategoryModal from "./CreateCategoryModal";

const DEFAULT_SORT_BY: CategorySortBy = "name";
const DEFAULT_SORT_DIR: CategorySortDir = "asc";

function parseSortBy(value: string | null): CategorySortBy {
  return value === "vendor_total" ? value : DEFAULT_SORT_BY;
}

function parseSortDir(value: string | null): CategorySortDir {
  return value === "desc" ? "desc" : DEFAULT_SORT_DIR;
}

function buildCategoriesHref(
  current: Pick<URLSearchParams, "toString">,
  updates: Record<string, string | undefined>,
) {
  const params = new URLSearchParams(current.toString());

  Object.entries(updates).forEach(([key, value]) => {
    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  });

  const query = params.toString();
  return query ? `/categories?${query}` : "/categories";
}

function sortCategories(
  categories: Category[],
  sortBy: CategorySortBy,
  sortDir: CategorySortDir,
) {
  return [...categories].sort((first, second) => {
    const direction = sortDir === "asc" ? 1 : -1;

    if (sortBy === "vendor_total") {
      return (first.vendor_total - second.vendor_total) * direction;
    }

    return first.name.localeCompare(second.name) * direction;
  });
}

function CategoriesErrorState({
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
          <div className="label-caps">Categories unavailable</div>
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

export default function CategoriesPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const sortBy = parseSortBy(searchParams.get("sort_by"));
  const sortDir = parseSortDir(searchParams.get("sort_dir"));

  useEffect(() => {
    const normalizedSortBy = searchParams.get("sort_by");
    const normalizedSortDir = searchParams.get("sort_dir");
    const normalizedSearch = searchParams.get("search");

    if (
      normalizedSortBy === sortBy &&
      normalizedSortDir === sortDir &&
      !normalizedSearch
    ) {
      return;
    }

    router.replace(
      buildCategoriesHref(searchParams, {
        sort_by: sortBy,
        sort_dir: sortDir,
        search: undefined,
      }),
    );
  }, [router, searchParams, sortBy, sortDir]);

  const categoriesQuery = useCategoriesList();
  const categories = useMemo(
    () => categoriesQuery.data ?? [],
    [categoriesQuery.data],
  );

  const visibleCategories = useMemo(() => {
    return sortCategories(categories, sortBy, sortDir);
  }, [categories, sortBy, sortDir]);

  const totalVendors = categories.reduce(
    (sum, category) => sum + category.vendor_total,
    0,
  );
  const assignedCategories = categories.filter(
    (category) => category.vendor_total > 0,
  ).length;

  const updateParams = (updates: Record<string, string | undefined>) => {
    router.replace(buildCategoriesHref(searchParams, updates));
  };

  return (
    <div className="space-y-8">
      <CreateCategoryModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <CategoryStats
        totalCategories={categories.length}
        totalVendors={totalVendors}
        assignedCategories={assignedCategories}
      />

      {categoriesQuery.isError ? (
        <CategoriesErrorState
          message={
            categoriesQuery.error.message ||
            "We could not load categories right now."
          }
          onRetry={() => categoriesQuery.refetch()}
        />
      ) : (
        <CategoryTable
          categories={visibleCategories}
          isLoading={categoriesQuery.isLoading}
          title="List of categories"
          filtersOpen={filtersOpen}
          onToggleFilters={() => setFiltersOpen((prev) => !prev)}
          filters={
            <CategoryFilters
              sortBy={sortBy}
              sortDir={sortDir}
              onSortByChange={(value) => updateParams({ sort_by: value })}
              onSortDirChange={(value) => updateParams({ sort_dir: value })}
              onClear={() => router.push("/categories")}
            />
          }
          onAddCategory={() => setIsCreateModalOpen(true)}
        />
      )}
    </div>
  );
}
