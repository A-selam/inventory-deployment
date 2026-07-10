"use client";

import { ArrowDownAZ, ChevronDown, X } from "lucide-react";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Label from "@/components/ui/label";

import type { WarehouseSortBy, WarehouseSortDir } from "./warehouses-utils";

const DEFAULT_LIMIT = 20;

type WarehouseFiltersProps = {
  sortBy: WarehouseSortBy;
  sortDir: WarehouseSortDir;
  limit: number;
  onSortByChange: (value: WarehouseSortBy) => void;
  onSortDirChange: (value: WarehouseSortDir) => void;
  onLimitChange: (value: number) => void;
  onClear: () => void;
};

export default function WarehouseFilters({
  sortBy,
  sortDir,
  limit,
  onSortByChange,
  onSortDirChange,
  onLimitChange,
  onClear,
}: WarehouseFiltersProps) {
  return (
    <Card className="rounded-[12px] border-border bg-card p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="grid gap-3 sm:grid-cols-[180px_150px_100px_auto] sm:items-end">
        <div className="min-w-0">
          <Label className="mb-1 text-[11px]">Sort by</Label>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(event) =>
                onSortByChange(event.target.value as WarehouseSortBy)
              }
              className="h-9 w-full appearance-none rounded-md border border-input bg-card px-3 pr-9 text-sm text-foreground outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="name">Name</option>
              <option value="location">Location</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div>
          <Label className="mb-1 text-[11px]">Direction</Label>
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

        <div>
          <Label className="mb-1 text-[11px]">Limit</Label>
          <input
            type="number"
            min={1}
            max={100}
            value={limit}
            onChange={(event) => {
              const value = event.target.value;
              onLimitChange(value ? Number.parseInt(value, 10) : DEFAULT_LIMIT);
            }}
            className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
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
    </Card>
  );
}

