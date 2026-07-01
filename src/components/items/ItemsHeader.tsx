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
    <div className="flex flex-wrap items-center justify-end gap-3">
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
  );
}
