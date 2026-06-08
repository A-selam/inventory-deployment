"use client";

import Modal from "@/components/ui/modal";

import CreateCategoryForm from "./CreateCategoryForm";

type CreateCategoryModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function CreateCategoryModal({
  open,
  onClose,
}: CreateCategoryModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add New Category"
      description="Create a new organizational layer for your logistics data."
      accent
      className="max-w-md overflow-hidden rounded-xl"
    >
      <CreateCategoryForm onCancel={onClose} onCreated={onClose} />
    </Modal>
  );
}
