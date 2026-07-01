"use client";

import Modal from "@/components/ui/modal";

import CreateWarehouseForm from "./CreateWarehouseForm";

type CreateWarehouseModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function CreateWarehouseModal({
  open,
  onClose,
}: CreateWarehouseModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Warehouse"
      description="Create a new storage location for inventory."
      accent
      className="max-w-lg overflow-hidden rounded-xl"
    >
      <CreateWarehouseForm onCancel={onClose} onCreated={onClose} />
    </Modal>
  );
}

