import { Plus } from "lucide-react";

import Button from "@/components/ui/button";

type WarehouseHeaderProps = {
  onAddWarehouse: () => void;
};

export default function WarehouseHeader({
  onAddWarehouse,
}: WarehouseHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      <Button
        type="button"
        className="h-11 gap-2 rounded-[10px] px-4"
        onClick={onAddWarehouse}
      >
        <Plus className="size-4" />
        Add Warehouse
      </Button>
    </div>
  );
}

