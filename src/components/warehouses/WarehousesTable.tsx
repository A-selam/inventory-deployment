import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Plus,
  SlidersHorizontal,
  Warehouse as WarehouseIcon,
} from "lucide-react";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Warehouse } from "@/lib/warehouses";

import WarehouseRowActions from "./WarehouseRowActions";

type WarehousesTableProps = {
  warehouses: Warehouse[];
  isLoading?: boolean;
  page?: number;
  totalPages?: number;
  limit?: number;
  totalWarehouses?: number;
  title?: string;
  filters?: React.ReactNode;
  filtersOpen?: boolean;
  onToggleFilters?: () => void;
  onAddWarehouse?: () => void;
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

export default function WarehousesTable({
  warehouses,
  isLoading = false,
  page = 1,
  totalPages = 1,
  limit = 20,
  totalWarehouses = 0,
  title = "List of warehouses",
  filters,
  filtersOpen = false,
  onToggleFilters,
  onAddWarehouse,
  onPageChange,
}: WarehousesTableProps) {
  return (
    <Card className="rounded-[12px] border border-border p-0 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="overflow-hidden rounded-md bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border bg-background px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-foreground">
              {title}
            </h2>
            <p className="text-xs text-muted-foreground">
              Showing page {page} of {totalPages} • {totalWarehouses} total
              warehouses • {limit} per page
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
              size="sm"
              className="h-9 gap-2"
              onClick={onAddWarehouse}
              disabled={!onAddWarehouse}
            >
              <Plus className="size-4" />
              Add Warehouse
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
            <p className="text-muted-foreground">Loading warehouses...</p>
          </div>
        ) : !warehouses || warehouses.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 p-12 text-center">
            <div className="flex size-14 items-center justify-center rounded-[14px] border border-border bg-muted text-muted-foreground">
              <WarehouseIcon className="size-6" />
            </div>
            <p className="text-muted-foreground">No warehouses found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-background shadow-sm [&_tr]:border-b">
                  <TableRow className="border-b">
                    <TableHead className="p-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Warehouse
                    </TableHead>
                    <TableHead className="p-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Location
                    </TableHead>
                    <TableHead className="p-2 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {warehouses.map((warehouse) => {
                    const location = warehouse.location?.trim() || "—";
                    // const description = warehouse.description?.trim() || "";

                    return (
                      <TableRow
                        key={warehouse.id}
                        className="border-b transition-colors hover:bg-[#F8FAFC] dark:hover:bg-muted"
                      >
                        <TableCell className="p-2 align-middle whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-[10px] bg-muted text-foreground">
                              <WarehouseIcon className="size-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="truncate font-semibold text-foreground">
                                {warehouse.name}
                              </div>
                              {/* {description ? (
                                <div className="truncate text-xs text-muted-foreground">
                                  {description}
                                </div>
                              ) : null}
                              <div className="truncate font-mono text-xs text-muted-foreground">
                                {warehouse.id}
                              </div> */}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="p-2 align-middle whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="size-4" />
                            <span className="truncate">{location}</span>
                          </div>
                        </TableCell>
                        <TableCell className="p-2 align-middle text-center">
                          <WarehouseRowActions warehouse={warehouse} />
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
