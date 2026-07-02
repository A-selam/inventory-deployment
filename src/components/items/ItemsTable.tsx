"use client";

import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  SlidersHorizontal,
  Upload,
} from "lucide-react";

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
import type { Item } from "@/lib/items";

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

type ItemsTableProps = {
  items: Item[];
  isLoading?: boolean;
  page?: number;
  totalPages?: number;
  limit?: number;
  totalItems?: number;
  title?: string;
  filters?: React.ReactNode;
  filtersOpen?: boolean;
  onToggleFilters?: () => void;
  onImport?: () => void;
  onAddItem?: () => void;
  onPageChange?: (page: number) => void;
};

function PaginationButton({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
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

function StockStatusBadge({
  quantity,
  minimum,
}: {
  quantity: number;
  minimum: number;
}) {
  if (quantity <= 0) {
    return (
      <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
        Out of Stock
      </span>
    );
  }
  if (quantity <= minimum) {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
        Low Stock
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
      In Stock
    </span>
  );
}

export default function ItemsTable({
  items,
  isLoading = false,
  page = 1,
  totalPages = 1,
  limit = 20,
  totalItems = 0,
  title = "List of items",
  filters,
  filtersOpen = false,
  onToggleFilters,
  onImport,
  onAddItem,
  onPageChange,
}: ItemsTableProps) {
  return (
    <Card className="rounded-[12px] border border-border p-0 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="overflow-hidden rounded-md bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border bg-background px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-foreground">
              {title}
            </h2>
            <p className="text-xs text-muted-foreground">
              Showing page {page} of {totalPages} • {totalItems} total items •{" "}
              {limit} per page
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
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

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 gap-2"
              onClick={onImport}
              disabled={!onImport}
            >
              <Upload className="size-4" />
              Import
            </Button>

            <Button
              type="button"
              size="sm"
              className="h-9 gap-2"
              onClick={onAddItem}
              disabled={!onAddItem}
            >
              <Plus className="size-4" />
              Add Item
            </Button>
          </div>
        </div>

        {filtersOpen && filters ? (
          <div className="border-b border-border bg-background px-4 py-3">
            {filters}
          </div>
        ) : null}

        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <p className="text-muted-foreground">Loading items...</p>
          </div>
        ) : !items || items.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12">
            <p className="text-muted-foreground">No items found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-background shadow-sm [&_tr]:border-b">
                  <TableRow className="border-b transition-colors hover:bg-[#F8FAFC] dark:hover:bg-muted">
                    <TableHead className="sticky top-0 z-10 bg-background p-2 whitespace-nowrap text-foreground has-[[role=checkbox]]:pr-0">
                      SKU
                    </TableHead>
                    <TableHead className="sticky top-0 z-10 bg-background p-2 whitespace-nowrap text-foreground has-[[role=checkbox]]:pr-0">
                      Name
                    </TableHead>
                    <TableHead className="sticky top-0 z-10 bg-background p-2 whitespace-nowrap text-foreground has-[[role=checkbox]]:pr-0">
                      Quantity
                    </TableHead>
                    <TableHead className="sticky top-0 z-10 bg-background p-2 whitespace-nowrap text-foreground has-[[role=checkbox]]:pr-0">
                      Status
                    </TableHead>
                    <TableHead className="sticky top-0 z-10 bg-background p-2 whitespace-nowrap text-foreground has-[[role=checkbox]]:pr-0">
                      Cost Price
                    </TableHead>
                    <TableHead className="sticky top-0 z-10 bg-background p-2 whitespace-nowrap text-foreground has-[[role=checkbox]]:pr-0">
                      Selling Price
                    </TableHead>
                    <TableHead className="sticky top-0 z-10 bg-background p-2 whitespace-nowrap text-foreground has-[[role=checkbox]]:pr-0">
                      Location
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => {
                    const quantity = item.quantity_on_hand;
                    const minimum = item.minimum_stock_level;
                    const cost = item.cost_price;
                    const selling = item.selling_price;
                    const location = item.bin_location;

                    return (
                      <TableRow
                        key={item.id}
                        className="border-b transition-colors hover:bg-[#F8FAFC] dark:hover:bg-muted"
                      >
                        <TableCell className="p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0 font-mono text-xs font-semibold text-primary">
                          <Link
                            className="hover:underline"
                            href={`/inventory/${item.id}`}
                          >
                            {item.sku}
                          </Link>
                        </TableCell>
                        <TableCell className="p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0">
                          <Link
                            className="font-semibold text-foreground hover:underline"
                            href={`/inventory/${item.id}`}
                          >
                            {item.name}
                          </Link>
                          {/* {item.description && (
                            <div className="text-xs text-muted-foreground">
                              {item.description}
                            </div>
                          )} */}
                        </TableCell>
                        <TableCell className="p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0">
                          <span className="font-mono font-bold text-foreground">
                            {quantity}
                          </span>
                          {/* <div className="text-xs text-muted-foreground">
                            Min: {minimum}
                          </div> */}
                        </TableCell>
                        <TableCell className="p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0">
                          <StockStatusBadge
                            quantity={quantity}
                            minimum={minimum}
                          />
                        </TableCell>
                        <TableCell className="p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0 text-foreground">
                          {formatCurrency(cost)}
                        </TableCell>
                        <TableCell className="p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0 text-foreground">
                          {formatCurrency(selling)}
                        </TableCell>
                        <TableCell className="p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0 text-muted-foreground">
                          {location}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col gap-3 border-t border-border bg-background px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <PaginationButton
                  disabled={page <= 1}
                  onClick={() => onPageChange?.(page - 1)}
                >
                  <ChevronLeft className="size-4" />
                  Previous
                </PaginationButton>

                <PaginationButton
                  disabled={page >= totalPages}
                  onClick={() => onPageChange?.(page + 1)}
                >
                  Next
                  <ChevronRight className="size-4" />
                </PaginationButton>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
