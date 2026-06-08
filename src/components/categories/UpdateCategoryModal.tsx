"use client";

import Modal from "@/components/ui/modal";

import UpdateCategoryForm from "./UpdateCategoryForm";

type UpdateCategoryModalProps = {
  open: boolean;
  onClose: () => void;
  categoryId: string;
  initialName: string;
};

export default function UpdateCategoryModal({
  open,
  onClose,
  categoryId,
  initialName,
}: UpdateCategoryModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Update Category"
      description="Rename the category. Changes apply immediately."
      accent
      className="max-w-md overflow-hidden rounded-xl"
    >
      <UpdateCategoryForm
        categoryId={categoryId}
        initialName={initialName}
        onCancel={onClose}
        onUpdated={onClose}
      />
    </Modal>
  );
}
