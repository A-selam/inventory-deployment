"use client";

import { useId, useState } from "react";

import Drawer from "@/components/ui/drawer";
import type { ItemDetail } from "@/types/items";

import UpdateItemDrawerFooter from "./UpdateItemDrawerFooter";
import UpdateItemForm from "./UpdateItemForm";

type UpdateItemDrawerProps = {
  open: boolean;
  onClose: () => void;
  item: ItemDetail;
};

export default function UpdateItemDrawer({
  open,
  onClose,
  item,
}: UpdateItemDrawerProps) {
  const formId = useId();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Update Item"
      description="SKU is immutable. Update the item details below."
      resizable
      storageKey="drawer-width:update-item"
      defaultWidth={520}
      minWidth={420}
      maxWidth={920}
    >
      <UpdateItemForm
        item={item}
        formId={formId}
        onUpdated={onClose}
        onSubmittingChange={setIsSubmitting}
      />
      <UpdateItemDrawerFooter
        formId={formId}
        isSubmitting={isSubmitting}
        onCancel={onClose}
      />
    </Drawer>
  );
}

