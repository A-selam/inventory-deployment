"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import Button from "@/components/ui/button";

type VendorPaginationProps = {
  page: number;
  totalPages: number;
  limit: number;
  totalItems: number;
  shownItems: number;
  onPageChange: (page: number) => void;
};

export default function VendorPagination({
  page,
  totalPages,
  limit,
  totalItems,
  shownItems,
  onPageChange,
}: VendorPaginationProps) {
  return (
    <div className="flex flex-col gap-3 border-t border-border py-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {shownItems} of {totalItems} vendors - page {page} of{" "}
        {totalPages} - {limit} per page
      </p>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-10 gap-2 rounded-[10px] px-3"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="size-4" />
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-10 gap-2 rounded-[10px] px-3"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
