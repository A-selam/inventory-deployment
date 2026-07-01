import { MapPin, Warehouse as WarehouseIcon } from "lucide-react";

import Card from "@/components/ui/card";
import type { Warehouse } from "@/lib/warehouses";

import {
  formatWarehouseDate,
  getWarehouseUtilizationPercent,
} from "./warehouses-utils";
import WarehouseRowActions from "./WarehouseRowActions";

type WarehousesTableProps = {
  warehouses: Warehouse[];
  isLoading?: boolean;
};

function WarehousesTableSkeleton() {
  return (
    <Card className="overflow-hidden rounded-[12px] border-border bg-card p-0 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="border-b border-border px-5 py-4">
        <div className="h-5 w-56 animate-pulse rounded bg-muted" />
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-1 items-center gap-4 px-5 py-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)_120px_120px_120px_170px_220px]"
          >
            <div className="flex items-center gap-3">
              <div className="size-9 animate-pulse rounded-[10px] bg-muted" />
              <div className="h-4 w-52 animate-pulse rounded bg-muted" />
            </div>
            <div className="h-4 w-40 animate-pulse rounded bg-muted" />
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
            <div className="h-9 w-44 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </Card>
  );
}

function WarehousesEmptyState() {
  return (
    <Card className="rounded-[12px] border-border bg-card p-10 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="mx-auto flex size-14 items-center justify-center rounded-[14px] border border-border bg-muted text-muted-foreground">
        <WarehouseIcon className="size-6" />
      </div>
      <h2 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
        No warehouses found
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        Try a different search term or clear the filters to return to the full
        warehouse list.
      </p>
    </Card>
  );
}

export default function WarehousesTable({
  warehouses,
  isLoading = false,
}: WarehousesTableProps) {
  if (isLoading) return <WarehousesTableSkeleton />;

  if (warehouses.length === 0) return <WarehousesEmptyState />;

  return (
    <Card className="overflow-hidden rounded-[12px] border-border bg-card p-0 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex flex-col gap-1 border-b border-border bg-card px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Warehouse directory
          </h2>
          <p className="text-sm text-muted-foreground">
            Connected to the Warehouses API response.
          </p>
        </div>
        <div className="label-caps">{warehouses.length} records</div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left">
          <thead className="bg-muted/60">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Warehouse
              </th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Location
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Capacity
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Used
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Available
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Created
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {warehouses.map((warehouse) => {
              const utilization = getWarehouseUtilizationPercent(warehouse);
              const location = warehouse.location?.trim() || "—";

              return (
                <tr
                  key={warehouse.id}
                  className="transition-colors hover:bg-muted/45"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-[10px] bg-muted text-foreground">
                        <WarehouseIcon className="size-4" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="font-semibold text-foreground">
                            {warehouse.name}
                          </div>
                          {utilization !== null ? (
                            <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
                              {Math.round(utilization)}%
                            </span>
                          ) : null}
                        </div>
                        <div className="font-mono text-xs text-muted-foreground">
                          {warehouse.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="size-4" />
                      <span className="truncate">{location}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="font-mono font-semibold text-foreground">
                      {warehouse.capacity > 0
                        ? warehouse.capacity.toLocaleString()
                        : "—"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="font-mono font-semibold text-foreground">
                      {warehouse.used_capacity.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="font-mono font-semibold text-foreground">
                      {warehouse.available_capacity.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right text-sm text-muted-foreground">
                    {formatWarehouseDate(warehouse.created_at)}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <WarehouseRowActions warehouse={warehouse} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
