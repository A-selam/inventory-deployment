"use client";

import { Loader2, Trash2 } from "lucide-react";

import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { useDeleteWarehouse } from "@/hooks/useWarehouses";
import { getApiErrorMessage } from "@/lib/api-errors";
import { useToast } from "@/providers/ToastProvider";

type DeleteWarehouseModalProps = {
  open: boolean;
  onClose: () => void;
  warehouseId: string;
  warehouseName: string;
  onDeleted?: () => void;
};

export default function DeleteWarehouseModal({
  open,
  onClose,
  warehouseId,
  warehouseName,
  onDeleted,
}: DeleteWarehouseModalProps) {
  const { toast } = useToast();
  const deleteWarehouseMutation = useDeleteWarehouse();

  const isSubmitting = deleteWarehouseMutation.isPending;

  const confirmDelete = async () => {
    try {
      await deleteWarehouseMutation.mutateAsync(warehouseId);
      toast({
        title: "Warehouse deleted",
        description: `"${warehouseName}" has been removed.`,
        variant: "success",
      });
      if (onDeleted) onDeleted();
      else onClose();
    } catch (error) {
      toast({
        title: "Failed to delete warehouse",
        description: getApiErrorMessage(error, "Please try again."),
        variant: "error",
      });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete Warehouse"
      description={`This will permanently delete "${warehouseName}".`}
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
      {deleteWarehouseMutation.isError ? (
        <p className="text-sm text-destructive">
          {getApiErrorMessage(
            deleteWarehouseMutation.error,
            "Failed to delete warehouse",
          )}
        </p>
      ) : (
        <div className="rounded-[12px] border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          Make sure this warehouse is no longer referenced by inventory before
          deleting.
        </div>
      )}
    </Modal>
  );
}

