"use client";

import { useId, useState } from "react";
import Drawer from "@/components/ui/drawer";
import type { Vendor } from "@/lib/vendors";
import CreateVendorDrawerFooter from "./CreateVendorDrawerFooter";
import CreateVendorForm from "./CreateVendorForm";

type CreateVendorDrawerProps = {
  open: boolean;
  onClose: () => void;
  mode?: "create" | "edit";
  vendor?: Vendor;
};

export default function CreateVendorDrawer({
  open,
  onClose,
  mode = "create",
  vendor,
}: CreateVendorDrawerProps) {
  const formId = useId();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEdit = mode === "edit";

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Supplier" : "Add New Supplier"}
      description={
        isEdit
          ? "Update the supplier details below."
          : "Enter the details of the new supplier to add them to your network."
      }
      className="max-w-[450px]"
    >
      <CreateVendorForm
        formId={formId}
        mode={mode}
        vendor={vendor}
        onSuccess={onClose}
        onSubmittingChange={setIsSubmitting}
      />
      <CreateVendorDrawerFooter
        formId={formId}
        isSubmitting={isSubmitting}
        onCancel={onClose}
        submitLabel={isEdit ? "Update Supplier" : "Create Supplier"}
      />
    </Drawer>
  );
}
