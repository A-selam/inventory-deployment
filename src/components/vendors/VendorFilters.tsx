"use client";

import { ArrowDownAZ, ChevronDown, X } from "lucide-react";

import Button from "@/components/ui/button";
import Label from "@/components/ui/label";
import type { VendorSortBy, VendorSortDir } from "@/lib/vendors";

type VendorFiltersProps = {
  sortBy: VendorSortBy;
  sortDir: VendorSortDir;
  onSortByChange: (value: VendorSortBy) => void;
  onSortDirChange: (value: VendorSortDir) => void;
  onClear: () => void;
};

export default function VendorFilters({
  sortBy,
  sortDir,
  onSortByChange,
  onSortDirChange,
  onClear,
}: VendorFiltersProps) {
  return (
    <div className="grid gap-3 md:grid-cols-[220px_200px_auto] md:items-end">
      <div>
        <Label className="mb-1 text-[11px]">Sort by</Label>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(event) => onSortByChange(event.target.value as VendorSortBy)}
            className="h-9 w-full appearance-none rounded-md border border-input bg-card px-2 pr-9 text-sm text-foreground outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="name">Name</option>
            <option value="contact_person">Contact person</option>
            <option value="lead_time">Lead time</option>
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
          className="h-9 w-full gap-2"
          onClick={() => onSortDirChange(sortDir === "asc" ? "desc" : "asc")}
        >
          <ArrowDownAZ className="size-4" />
          {sortDir === "asc" ? "Ascending" : "Descending"}
        </Button>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-9 gap-2"
        onClick={onClear}
      >
        <X className="size-4" />
        Clear
      </Button>
    </div>
  );
}
