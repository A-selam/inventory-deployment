import { Boxes, ChartPie, ClipboardList, MapPin } from "lucide-react";

import Card from "@/components/ui/card";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import type { Warehouse } from "@/lib/warehouses";

import { getWarehouseUtilizationPercent } from "./warehouses-utils";

type WarehouseOverviewCardsProps = {
  warehouse: Warehouse;
};

export default function WarehouseOverviewCards({
  warehouse,
}: WarehouseOverviewCardsProps) {
  const utilization = getWarehouseUtilizationPercent(warehouse);
  const hasCapacity = warehouse.capacity > 0;
  const location = warehouse.location?.trim() || "Not set";

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="rounded-[12px] border-border bg-card p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="label-caps">Utilization</div>
            <div className="text-3xl font-bold tracking-tight text-foreground">
              {utilization !== null ? `${Math.round(utilization)}%` : "—"}
            </div>
            <div className="text-sm text-muted-foreground">
              {hasCapacity
                ? `${warehouse.used_capacity.toLocaleString()} used of ${warehouse.capacity.toLocaleString()}`
                : `${warehouse.used_capacity.toLocaleString()} used (capacity not set)`}
            </div>
          </div>
          <div className="flex size-11 items-center justify-center rounded-[12px] bg-muted text-foreground">
            <ChartPie className="size-5" />
          </div>
        </div>

        {utilization !== null ? (
          <div className="mt-5">
            <Progress value={utilization} className="gap-2">
              <ProgressLabel className="text-sm font-medium text-foreground">
                Capacity used
              </ProgressLabel>
              <ProgressValue />
            </Progress>
          </div>
        ) : null}
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="rounded-[12px] border-border bg-card p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="label-caps">Used</div>
              <div className="mt-3 text-3xl font-bold tracking-tight text-foreground">
                {warehouse.used_capacity.toLocaleString()}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Units in use</p>
            </div>
            <div className="flex size-11 items-center justify-center rounded-[12px] bg-muted text-foreground">
              <ClipboardList className="size-5" />
            </div>
          </div>
        </Card>

        <Card className="rounded-[12px] border-border bg-card p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="label-caps">Available</div>
              <div className="mt-3 text-3xl font-bold tracking-tight text-foreground">
                {warehouse.available_capacity.toLocaleString()}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Units remaining
              </p>
            </div>
            <div className="flex size-11 items-center justify-center rounded-[12px] bg-muted text-foreground">
              <Boxes className="size-5" />
            </div>
          </div>
        </Card>

        <Card className="rounded-[12px] border-border bg-card p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="label-caps">Location</div>
              <div className="mt-3 text-lg font-semibold tracking-tight text-foreground">
                {location}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Used for reporting and routing.
              </p>
            </div>
            <div className="flex size-11 items-center justify-center rounded-[12px] bg-muted text-foreground">
              <MapPin className="size-5" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
