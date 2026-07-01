"use client";

import Link from "next/link";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

import Button from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Warehouse } from "@/lib/warehouses";

import { getWarehouseUtilizationPercent } from "./warehouses-utils";

type WarehouseDetailHeaderProps = {
  warehouse: Warehouse;
  onEdit: () => void;
  onDelete: () => void;
};

export default function WarehouseDetailHeader({
  warehouse,
  onEdit,
  onDelete,
}: WarehouseDetailHeaderProps) {
  const utilization = getWarehouseUtilizationPercent(warehouse);
  const location = warehouse.location?.trim();

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <Link
          href="/warehouses"
          className="inline-flex items-center gap-1 hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to warehouses
        </Link>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {warehouse.name}
            </h1>
            {warehouse.description ? (
              <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
                {warehouse.description}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {location ? (
              <Badge className="bg-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {location}
              </Badge>
            ) : null}
            <Badge className="bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-700">
              Capacity:{" "}
              {warehouse.capacity > 0
                ? warehouse.capacity.toLocaleString()
                : "Not set"}
            </Badge>
            {utilization !== null ? (
              <Badge className="bg-secondary px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-secondary-foreground">
                {Math.round(utilization)}% utilized
              </Badge>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-11 gap-2 rounded-[10px] px-4"
            onClick={onEdit}
          >
            <Pencil className="size-4" />
            Edit
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 gap-2 rounded-[10px] border-destructive/30 px-4 text-destructive hover:bg-destructive/10"
            onClick={onDelete}
          >
            <Trash2 className="size-4" />
            Delete
          </Button>
        </div>
      </div>
    </section>
  );
}
