import { Plus } from "lucide-react";

import Button from "@/components/ui/button";

type WarehouseHeaderProps = {
  onAddWarehouse: () => void;
};

export default function WarehouseHeader({
  onAddWarehouse,
}: WarehouseHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="label-caps">Inventory / Warehouses</div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
          Warehouses
        </h1>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
          Track storage locations, capacity, and utilization across your network.
        </p>
      </div>

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

