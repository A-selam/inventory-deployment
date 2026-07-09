"use client";

import type { ReactNode } from "react";

import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";

import Button from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type PaginationButtonProps = {
  children: ReactNode;
  disabled?: boolean;
  onClick: () => void;
};

function PaginationButton({ children, disabled, onClick }: PaginationButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={disabled}
      className="h-9 gap-2 px-3"
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

type StandardDataTableProps = {
  title: string;
  page: number;
  totalPages: number;
  totalItems: number;
  limit: number;

  isLoading?: boolean;
  loadingText?: string;



  /**
   * Total number of items currently displayed (used to decide the empty state).
   * If omitted, empty-state rendering will fall back to the provided tableBody.
   */
  itemsCount?: number;

  filters?: ReactNode;
  filtersOpen?: boolean;
  onToggleFilters?: () => void;

  addAction?: {
    label: string;
    onClick?: () => void;
    disabled?: boolean;
    icon?: ReactNode;
  };

  maxTableHeightClassName?: string;

  tableHead: ReactNode;
  tableBody: ReactNode;

  /** Default empty-state (used when emptyStateOverride is not provided) */
  emptyState: {
    title: string;
    description?: string;
  };

  /** Optional fully custom empty UI (e.g. icon + description) */
  emptyStateOverride?: ReactNode;

  pagination?: {
    onPageChange?: (page: number) => void;
  };
};

export default function StandardDataTable({
  title,
  page,
  totalPages,
  totalItems,
  limit,
  isLoading = false,
  loadingText,
  itemsCount,
  filters,
  filtersOpen = false,
  onToggleFilters,
  addAction,
  maxTableHeightClassName = "max-h-[70vh]",
  tableHead,
  tableBody,
  emptyState,
  emptyStateOverride,
  pagination,
}: StandardDataTableProps) {
  return (
    <Card className="rounded-[12px] border border-border p-0 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="overflow-hidden rounded-md bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border bg-background px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-base font-semibold text-foreground">{title}</h2>
              <span className="inline-flex items-center rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-xs font-semibold text-foreground">
                {totalItems.toLocaleString()} total 
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Showing page {page} of {totalPages} • {totalItems} total items • {limit} per page
            </p>
          </div>

          {(filters || onToggleFilters || addAction) ? (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              {filters || onToggleFilters ? (
                <Button
                  type="button"
                  variant={filtersOpen ? "default" : "outline"}
                  size="sm"
                  className="h-9 gap-2"
                  onClick={onToggleFilters}
                  disabled={!filters || !onToggleFilters}
                >
                  <SlidersHorizontal className="size-4" />
                  Filters
                </Button>
              ) : null}

              {addAction ? (
                <Button
                  type="button"
                  size="sm"
                  className="h-9 gap-2"
                  onClick={addAction.onClick}
                  disabled={addAction.disabled}
                >
                  {addAction.icon ? addAction.icon : null}
                  {addAction.label}
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>

        {filtersOpen && filters ? (
          <div className="border-b border-border bg-background px-4 py-3">{filters}</div>
        ) : null}

        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <p className="text-muted-foreground">{loadingText ?? "Loading..."}</p>
          </div>
        ) : (
          <>
            <div className={maxTableHeightClassName + " overflow-auto"}>
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-background shadow-sm [&_tr]:border-b">
                  <TableRow className="border-b transition-colors hover:bg-[#F8FAFC] dark:hover:bg-muted">
                    {tableHead}
                  </TableRow>
                </TableHeader>

                <TableBody>{tableBody}</TableBody>
              </Table>
            </div>

            {itemsCount !== undefined && itemsCount === 0 ? (
              emptyStateOverride ?? (
                <StandardEmptyRow
                  colSpan={100}
                  title={emptyState.title}
                  description={emptyState.description}
                />
              )
            ) : null}
          </>
        )}

        {/* Pagination - must match AlertsTable layout */}
        <div className="flex flex-col gap-3 border-t border-border bg-background px-4 py-3 sm:flex-row sm:items-center sm:justify-end">
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <PaginationButton
              disabled={page <= 1}
              onClick={() => pagination?.onPageChange?.(page - 1)}
            >
              <ChevronLeft className="size-4" />
              Previous
            </PaginationButton>

            <PaginationButton
              disabled={page >= totalPages}
              onClick={() => pagination?.onPageChange?.(page + 1)}
            >
              Next
              <ChevronRight className="size-4" />
            </PaginationButton>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function StandardTableHeadCell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <TableHead className={`sticky top-0 z-10 bg-background p-2 text-foreground ${className}`}>
      {children}
    </TableHead>
  );
}

export function StandardEmptyRow({
  colSpan,
  title,
  description,
}: {
  colSpan: number;
  title: string;
  description?: string;
}) {
  return (
    <TableRow className="border-b transition-colors hover:bg-[#F8FAFC] dark:hover:bg-muted">
      <TableCell colSpan={colSpan} className="p-6 align-middle whitespace-nowrap">
        <div className="flex min-h-32 flex-col items-center justify-center rounded-md border border-dashed border-border bg-muted/20 px-6 py-10 text-center">
          <p className="text-sm font-medium text-foreground">{title}</p>
          {description ? (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </TableCell>
    </TableRow>
  );
}

