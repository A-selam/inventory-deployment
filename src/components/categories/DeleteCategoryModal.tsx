"use client";

import { Loader2, Trash2 } from "lucide-react";

import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { useDeleteCategory } from "@/hooks/useCategories";
import { getApiErrorMessage } from "@/lib/api-errors";
import { useToast } from "@/providers/ToastProvider";

type DeleteCategoryModalProps = {
  open: boolean;
  onClose: () => void;
  categoryId: string;
  categoryName: string;
};

export default function DeleteCategoryModal({
  open,
  onClose,
  categoryId,
  categoryName,
}: DeleteCategoryModalProps) {
  const { toast } = useToast();
  const deleteCategoryMutation = useDeleteCategory();

  const isSubmitting = deleteCategoryMutation.isPending;

  const confirmDelete = async () => {
    try {
      await deleteCategoryMutation.mutateAsync(categoryId);
      toast({
        title: "Category deleted",
        description: `"${categoryName}" has been removed.`,
        variant: "success",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Failed to delete category",
        description: getApiErrorMessage(error, "Please try again."),
        variant: "error",
      });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete Category"
      description={`This will permanently delete "${categoryName}".`}
      accent
      accentClassName="bg-destructive"
      className="max-w-md overflow-hidden rounded-xl text-left"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl px-5"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="h-11 gap-2 rounded-xl bg-destructive px-5 text-white hover:bg-destructive/90"
            onClick={confirmDelete}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
            <span>Delete</span>
          </Button>
        </>
      }
    >
      {deleteCategoryMutation.isError ? (
        <p className="text-sm text-destructive">
          {getApiErrorMessage(
            deleteCategoryMutation.error,
            "Failed to delete category",
          )}
        </p>
      ) : (
        <div className="rounded-[12px] border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          Soft Deletion - Vendors assigned to this category will still be
          assigned.
        </div>
      )}
    </Modal>
  );
}
