"use client";

import { Plus } from "lucide-react";

import Button from "@/components/ui/button";

type ItemsHeaderProps = {
  activeSkus?: number;
  belowThreshold?: number;
  onAddItem?: () => void;
};

export default function ItemsHeader({
  activeSkus = 0,
  belowThreshold = 0,
  onAddItem,
}: ItemsHeaderProps) {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="mb-1 text-3xl font-bold tracking-tight text-foreground">
            Inventory
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage and track all items in your warehouse.
          </p>
        </div>
        {onAddItem ? (
          <Button
            type="button"
            className="h-11 shrink-0 gap-2 rounded-[10px] px-4"
            onClick={onAddItem}
          >
            <Plus className="size-4" />
            Add Item
          </Button>
        ) : null}
      </div>

      <section className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-[12px] border border-border bg-card p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="label-caps">Active SKUs</div>
          <div className="mt-2 text-2xl font-bold">
            {new Intl.NumberFormat("en-US").format(activeSkus)}
          </div>
        </article>

        <article className="rounded-[12px] border border-border bg-card p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="label-caps">Below Threshold</div>
          <div className="mt-2 text-2xl font-bold">
            {new Intl.NumberFormat("en-US").format(belowThreshold)}
          </div>
        </article>
      </section>
    </div>
  );
}
