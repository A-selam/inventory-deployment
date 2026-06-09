"use client";

import { Plus } from "lucide-react";

import Button from "@/components/ui/button";

type ItemsHeaderProps = {
  activeSkus?: number;
  belowThreshold?: number;
  onAddItem?: () => void;
};

export default function ItemsHeader({ onAddItem }: ItemsHeaderProps) {
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
    </div>
  );
}
