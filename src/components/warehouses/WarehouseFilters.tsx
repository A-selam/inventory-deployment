"use client";

import { ArrowDownAZ, X } from "lucide-react";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";

import type { WarehouseSortBy, WarehouseSortDir } from "./warehouses-utils";

type WarehouseFiltersProps = {
  sortBy: WarehouseSortBy;
  sortDir: WarehouseSortDir;
  onSortByChange: (value: WarehouseSortBy) => void;
  onSortDirChange: (value: WarehouseSortDir) => void;
  onClear: () => void;
};

export default function WarehouseFilters({
  sortBy,
  sortDir,
  onSortByChange,
  onSortDirChange,
  onClear,
}: WarehouseFiltersProps) {
  return (
    <Card className="rounded-[12px] border-border bg-card p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="grid gap-3 sm:grid-cols-[180px_150px_auto] sm:items-end">
        <div className="min-w-0">
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Sort by
          </label>
          <select
            value={sortBy}
            onChange={(event) =>
              onSortByChange(event.target.value as WarehouseSortBy)
            }
            className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="name">Name</option>
            <option value="location">Location</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Direction
          </label>
          <Button
            type="button"
            variant="outline"
            className="h-9 w-full gap-2 rounded-md px-3"
            onClick={() => onSortDirChange(sortDir === "asc" ? "desc" : "asc")}
          >
            <ArrowDownAZ className="size-4" />
            {sortDir === "asc" ? "Ascending" : "Descending"}
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-9 gap-2 rounded-md px-4"
          onClick={onClear}
        >
          <X className="size-4" />
          Clear
        </Button>
      </div>
    </Card>
  );
}

