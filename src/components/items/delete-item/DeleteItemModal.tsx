"use client";

import { Loader2, Trash } from "lucide-react";

import Modal from "@/components/ui/modal";
import Button from "@/components/ui/button";
import type { ItemDetail } from "@/types/items";

type DeleteItemModalProps = {
  open: boolean;
  item: ItemDetail;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteItemModal({
  open,
  item,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteItemModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete item"
      description="This action cannot be undone."
      className="max-w-md overflow-hidden rounded-xl"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl px-5"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="h-11 gap-2 rounded-xl bg-destructive px-5 text-destructive-foreground hover:bg-destructive/90"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? <Loader2 className="size-4 animate-spin" /> : null}
            <Trash className="size-4" />
            <span>Delete</span>
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          You’re about to delete:
        </p>
        <div className="rounded-[12px] border border-border bg-muted/30 p-4">
          <div className="text-sm font-semibold text-foreground">{item.name}</div>
          <div className="mt-1 text-xs text-muted-foreground">{item.sku}</div>
        </div>
      </div>
    </Modal>
  );
}

