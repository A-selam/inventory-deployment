"use client";

import type { ReactNode } from "react";
import { useEffect, useId } from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import Button from "@/components/ui/button";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export default function Drawer({
  open,
  onClose,
  title,
  description,
  children,
  className,
}: DrawerProps) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close panel"
        className={cn("absolute inset-0 bg-black/40 animate-in fade-in-0")}
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-[460px] flex-col border-l border-border bg-card shadow-2xl animate-in slide-in-from-right-4",
          className,
        )}
      >
        <div className="border-b border-border px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 space-y-1">
              <h2
                id={titleId}
                className="truncate text-lg font-semibold text-foreground"
              >
                {title}
              </h2>
              {description ? (
                <p id={descriptionId} className="text-sm text-muted-foreground">
                  {description}
                </p>
              ) : null}
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="size-9 shrink-0 p-0"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        {children}
      </aside>
    </div>
  );
}
