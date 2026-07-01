"use client";

import Modal from "@/components/ui/modal";

import UpdateWarehouseForm from "./UpdateWarehouseForm";

type UpdateWarehouseModalProps = {
  open: boolean;
  onClose: () => void;
  warehouseId: string;
  initialName: string;
  initialLocation: string | null;
  initialCapacity: number;
  initialDescription: string | null;
};

export default function UpdateWarehouseModal({
  open,
  onClose,
  warehouseId,
  initialName,
  initialLocation,
  initialCapacity,
  initialDescription,
}: UpdateWarehouseModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Update Warehouse"
      description="Edit warehouse details. Changes apply immediately."
      accent
      className="max-w-lg overflow-hidden rounded-xl"
    >
      <UpdateWarehouseForm
        warehouseId={warehouseId}
        initialName={initialName}
        initialLocation={initialLocation}
        initialCapacity={initialCapacity}
        initialDescription={initialDescription}
        onCancel={onClose}
        onUpdated={onClose}
      />
    </Modal>
  );
}
