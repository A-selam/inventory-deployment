import { Search, RotateCcw } from "lucide-react";

import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Card from "@/components/ui/card";
import type { Category } from "@/lib/categories";

type ReplenishmentFiltersProps = {
  search: string;
  category: string;
  categories: Category[];
  isCategoriesLoading?: boolean;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onClear: () => void;
};

export default function ReplenishmentFilters({
  search,
  category,
  categories,
  isCategoriesLoading = false,
  onSearchChange,
  onCategoryChange,
  onClear,
}: ReplenishmentFiltersProps) {
  const hasFilters = Boolean(search || category);

  return (
    <Card className="rounded-[12px] border-border bg-card p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="grid flex-1 gap-4 md:grid-cols-[minmax(0,1fr)_240px]">
          <label className="space-y-2">
            <span className="label-caps">Search item</span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search by item name or SKU"
                className="h-11 bg-background pl-10"
              />
            </div>
          </label>

          <label className="space-y-2">
            <span className="label-caps">Category</span>
            <select
              value={category}
              onChange={(event) => onCategoryChange(event.target.value)}
              disabled={isCategoriesLoading}
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">All categories</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex items-center gap-3 xl:self-start">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-11 gap-2 px-4"
            onClick={onClear}
            disabled={!hasFilters}
          >
            <RotateCcw className="size-4" />
            Clear filters
          </Button>
        </div>
      </div>
    </Card>
  );
}
