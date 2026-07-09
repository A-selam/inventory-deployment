"use client";

import type { ReactNode } from "react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
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
  resizable?: boolean;
  minWidth?: number;
  maxWidth?: number;
  defaultWidth?: number;
  storageKey?: string;
};

export default function Drawer({
  open,
  onClose,
  title,
  description,
  children,
  className,
  resizable = false,
  minWidth = 380,
  maxWidth = 920,
  defaultWidth = 460,
  storageKey,
}: DrawerProps) {
  const titleId = useId();
  const descriptionId = useId();
  const [isLargeScreen, setIsLargeScreen] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(min-width: 640px)").matches;
  });
  const [drawerWidth, setDrawerWidth] = useState<number | null>(() => {
    if (!resizable) return null;
    if (typeof window === "undefined") return defaultWidth;
    if (!window.matchMedia("(min-width: 640px)").matches) return defaultWidth;

    const storedWidth = storageKey
      ? window.localStorage.getItem(storageKey)
      : null;
    const parsedStoredWidth = storedWidth ? Number(storedWidth) : Number.NaN;
    const baseWidth = Number.isFinite(parsedStoredWidth)
      ? parsedStoredWidth
      : defaultWidth;
    const viewportMax = window.innerWidth - 32;
    const effectiveMax = Math.min(maxWidth, viewportMax);
    return Math.max(minWidth, Math.min(effectiveMax, baseWidth));
  });
  const [isResizing, setIsResizing] = useState(false);
  const dragRef = useRef<{ startX: number; startWidth: number } | null>(null);
  const shouldResize = resizable && isLargeScreen;

  const clampWidth = useMemo(() => {
    return (width: number) => {
      const viewportMax =
        typeof window === "undefined" ? maxWidth : window.innerWidth - 32;
      const effectiveMax = Math.min(maxWidth, viewportMax);
      return Math.max(minWidth, Math.min(effectiveMax, width));
    };
  }, [maxWidth, minWidth]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 640px)");
    const onChange = (event: MediaQueryListEvent) =>
      setIsLargeScreen(event.matches);
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!shouldResize) return;
    if (!storageKey) return;
    if (!open) return;
    if (drawerWidth == null) return;

    window.localStorage.setItem(storageKey, String(drawerWidth));
  }, [drawerWidth, open, shouldResize, storageKey]);

  useEffect(() => {
    if (!isResizing) return;

    const previousUserSelect = document.body.style.userSelect;
    const previousCursor = document.body.style.cursor;
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";

    const onMove = (event: PointerEvent) => {
      const dragState = dragRef.current;
      if (!dragState) return;
      const delta = dragState.startX - event.clientX;
      setDrawerWidth(clampWidth(dragState.startWidth + delta));
    };

    const stop = () => {
      dragRef.current = null;
      setIsResizing(false);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
      document.body.style.userSelect = previousUserSelect;
      document.body.style.cursor = previousCursor;
    };
  }, [clampWidth, isResizing]);

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
          shouldResize
            ? "absolute inset-y-0 right-0 flex flex-col border-l border-border bg-card shadow-2xl animate-in slide-in-from-right-4"
            : "absolute inset-y-0 right-0 flex w-full max-w-[460px] flex-col border-l border-border bg-card shadow-2xl animate-in slide-in-from-right-4",
          className,
        )}
        style={
          shouldResize && drawerWidth != null
            ? { width: drawerWidth }
            : undefined
        }
      >
        {shouldResize ? (
          <div
            role="separator"
            aria-label="Resize panel"
            aria-orientation="vertical"
            tabIndex={0}
            className={cn(
              "absolute inset-y-0 left-0 w-3 cursor-col-resize touch-none select-none",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
              "hover:bg-muted/50",
            )}
            onPointerDown={(event) => {
              if (event.button !== 0) return;
              const nextStartWidth = drawerWidth ?? clampWidth(defaultWidth);
              dragRef.current = {
                startX: event.clientX,
                startWidth: nextStartWidth,
              };
              setDrawerWidth(nextStartWidth);
              setIsResizing(true);
            }}
            onKeyDown={(event) => {
              if (drawerWidth == null) return;
              if (event.key === "ArrowLeft") {
                event.preventDefault();
                setDrawerWidth(clampWidth(drawerWidth + 16));
              }
              if (event.key === "ArrowRight") {
                event.preventDefault();
                setDrawerWidth(clampWidth(drawerWidth - 16));
              }
              if (event.key === "Home") {
                event.preventDefault();
                setDrawerWidth(clampWidth(minWidth));
              }
              if (event.key === "End") {
                event.preventDefault();
                setDrawerWidth(clampWidth(maxWidth));
              }
            }}
          >
            <div
              className={cn(
                "absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border",
                isResizing ? "bg-foreground/20" : undefined,
              )}
            />
          </div>
        ) : null}

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
