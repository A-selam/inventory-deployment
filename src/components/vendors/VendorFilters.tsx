"use client";

import { ArrowDownAZ, ChevronDown, Search, X } from "lucide-react";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { VendorSortBy, VendorSortDir } from "@/lib/vendors";

type VendorFiltersProps = {
  search: string;
  sortBy: VendorSortBy;
  sortDir: VendorSortDir;
  onSearchChange: (value: string) => void;
  onSortByChange: (value: VendorSortBy) => void;
  onSortDirChange: (value: VendorSortDir) => void;
  onClear: () => void;
};

export default function VendorFilters({
  search,
  sortBy,
  sortDir,
  onSearchChange,
  onSortByChange,
  onSortDirChange,
  onClear,
}: VendorFiltersProps) {
  return (
    <Card className="rounded-[12px] border-border bg-card p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_190px_150px_auto] lg:items-end">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Search
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search by vendor or contact person"
              className="h-11 rounded-[10px] pl-9"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Sort by
          </label>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(event) =>
                onSortByChange(event.target.value as VendorSortBy)
              }
              className="h-11 w-full appearance-none rounded-[10px] border border-input bg-card px-3 pr-10 text-sm text-foreground outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="name">Name</option>
              <option value="contact_person">Contact person</option>
              <option value="lead_time">Lead time</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Direction
          </label>
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full gap-2 rounded-[10px] px-3"
            onClick={() => onSortDirChange(sortDir === "asc" ? "desc" : "asc")}
          >
            <ArrowDownAZ className="size-4" />
            {sortDir === "asc" ? "Ascending" : "Descending"}
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-11 gap-2 rounded-[10px] px-4"
          onClick={onClear}
        >
          <X className="size-4" />
          Clear
        </Button>
      </div>
    </Card>
  );
}
