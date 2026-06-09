"use client";

import { useId, useState } from "react";

import Drawer from "@/components/ui/drawer";

import CreateItemDrawerFooter from "./CreateItemDrawerFooter";
import CreateItemForm from "./CreateItemForm";

type CreateItemDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export default function CreateItemDrawer({ open, onClose }: CreateItemDrawerProps) {
  const formId = useId();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Add New Item"
      description="Enter the details of the new inventory item below."
      className="max-w-[450px]"
    >
      <CreateItemForm
        formId={formId}
        onCreated={onClose}
        onSubmittingChange={setIsSubmitting}
      />
      <CreateItemDrawerFooter
        formId={formId}
        isSubmitting={isSubmitting}
        onCancel={onClose}
      />
    </Drawer>
  );
}

