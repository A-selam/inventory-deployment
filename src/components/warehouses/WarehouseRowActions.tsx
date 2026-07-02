"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
// import { useRouter } from "next/navigation";

import Button from "@/components/ui/button";
import type { Warehouse } from "@/lib/warehouses";

import DeleteWarehouseModal from "./DeleteWarehouseModal";
import UpdateWarehouseModal from "./UpdateWarehouseModal";

type WarehouseRowActionsProps = {
  warehouse: Warehouse;
};

export default function WarehouseRowActions({
  warehouse,
}: WarehouseRowActionsProps) {
  // const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        {/* <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 gap-2 rounded-[10px] px-3"
          onClick={() => router.push(`/warehouses/${warehouse.id}`)}
        >
          <Eye className="size-4" />
          View
        </Button> */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 gap-2 rounded-[10px] px-3"
          onClick={() => setIsEditOpen(true)}
        >
          <Pencil className="size-4" />
          Edit
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 gap-2 rounded-[10px] border-destructive/30 text-destructive hover:bg-destructive/10"
          onClick={() => setIsDeleteOpen(true)}
        >
          <Trash2 className="size-4" />
          Delete
        </Button>
      </div>

      <UpdateWarehouseModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        warehouseId={warehouse.id}
        initialName={warehouse.name}
        initialLocation={warehouse.location}
        initialCapacity={warehouse.capacity}
        initialDescription={warehouse.description}
      />

      <DeleteWarehouseModal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        warehouseId={warehouse.id}
        warehouseName={warehouse.name}
      />
    </>
  );
}
