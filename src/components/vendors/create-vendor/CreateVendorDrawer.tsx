"use client";

import { useId, useState } from "react";
import Drawer from "@/components/ui/drawer";
import CreateVendorDrawerFooter from "./CreateVendorDrawerFooter";
import CreateVendorForm from "./CreateVendorForm";

type CreateVendorDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export default function CreateVendorDrawer({
  open,
  onClose,
}: CreateVendorDrawerProps) {
  const formId = useId();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Add New Vendor"
      description="Enter the details of the new supplier to add them to your network."
      className="max-w-[450px]"
    >
      <CreateVendorForm
        formId={formId}
        onCreated={onClose}
        onSubmittingChange={setIsSubmitting}
      />
      <CreateVendorDrawerFooter
        formId={formId}
        isSubmitting={isSubmitting}
        onCancel={onClose}
      />
    </Drawer>
  );
}
