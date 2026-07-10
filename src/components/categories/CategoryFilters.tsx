"use client";

import { ArrowDownAZ, ChevronDown, X } from "lucide-react";

import Button from "@/components/ui/button";
import Label from "@/components/ui/label";
import type { CategorySortBy, CategorySortDir } from "@/lib/categories";

type CategoryFiltersProps = {
  sortBy: CategorySortBy;
  sortDir: CategorySortDir;
  onSortByChange: (value: CategorySortBy) => void;
  onSortDirChange: (value: CategorySortDir) => void;
  onClear: () => void;
};

export default function CategoryFilters({
  sortBy,
  sortDir,
  onSortByChange,
  onSortDirChange,
  onClear,
}: CategoryFiltersProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-[220px_180px_auto] lg:items-end">
      <div>
        <Label className="mb-1 text-[11px]">Sort by</Label>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(event) =>
              onSortByChange(event.target.value as CategorySortBy)
            }
            className="h-9 w-full appearance-none rounded-md border border-input bg-transparent px-3 pr-9 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          >
            <option value="name">Name</option>
            <option value="vendor_total">Vendor total</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      <div>
        <Label className="mb-1 text-[11px]">Direction</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 w-full gap-2 rounded-md px-3"
          onClick={() => onSortDirChange(sortDir === "asc" ? "desc" : "asc")}
        >
          <ArrowDownAZ className="size-4" />
          {sortDir === "asc" ? "Ascending" : "Descending"}
        </Button>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-md"
        onClick={onClear}
        title="Clear filters"
      >
        <X className="size-4" />
      </Button>
    </div>
  );
}
