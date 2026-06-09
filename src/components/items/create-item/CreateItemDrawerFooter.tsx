"use client";

import { Loader2 } from "lucide-react";

import Button from "@/components/ui/button";

type CreateItemDrawerFooterProps = {
  formId: string;
  isSubmitting: boolean;
  onCancel: () => void;
};

export default function CreateItemDrawerFooter({
  formId,
  isSubmitting,
  onCancel,
}: CreateItemDrawerFooterProps) {
  return (
    <div className="flex items-center gap-3 border-t border-border bg-card px-6 py-5">
      <Button
        type="button"
        variant="outline"
        className="h-11 flex-1 rounded-[10px]"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        form={formId}
        className="h-11 flex-1 gap-2 rounded-[10px]"
        disabled={isSubmitting}
      >
        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
        <span>Save Item</span>
      </Button>
    </div>
  );
}

