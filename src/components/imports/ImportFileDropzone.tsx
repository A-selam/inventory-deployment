"use client";

import { useMemo, useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";

import { cn } from "@/lib/utils";

const MAX_BYTES = 25 * 1024 * 1024;

function isSupportedFile(file: File) {
  const name = file.name.toLowerCase();
  return name.endsWith(".csv");
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${Math.round(bytes / (1024 * 1024))} MB`;
}

export default function ImportFileDropzone({
  onFileSelected,
  disabled,
}: {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const helperText = useMemo(() => {
    if (!lastError) return "CSV only • Max file size 25MB";
    return lastError;
  }, [lastError]);

  const pickFile = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleFile = (file: File | null | undefined) => {
    if (!file) return;

    if (!isSupportedFile(file)) {
      setLastError("Unsupported file type. Please upload a CSV.");
      return;
    }

    if (file.size > MAX_BYTES) {
      setLastError(
        `File is too large (${formatBytes(file.size)}). Max is 25MB.`,
      );
      return;
    }

    setLastError(null);
    onFileSelected(file);
  };

  return (
    <section
      role="button"
      tabIndex={0}
      aria-disabled={disabled ? "true" : "false"}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-xl border-2 border-dashed bg-card p-10 text-center shadow-sm transition-colors",
        dragActive ? "border-primary" : "border-border",
        disabled && "cursor-not-allowed opacity-70",
      )}
      onClick={pickFile}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") pickFile();
      }}
      onDragEnter={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) return;
        setDragActive(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) return;
        setDragActive(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (disabled) return;
        handleFile(e.dataTransfer.files?.[0]);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="sr-only"
        disabled={disabled}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 py-10">
        <div className="flex size-16 items-center justify-center rounded-full bg-muted transition-colors group-hover:bg-primary/10">
          {disabled ? (
            <Loader2 className="size-7 animate-spin text-primary" />
          ) : (
            <Upload className="size-7 text-primary" />
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            Drop your CSV here
          </h3>
          <p className="text-sm text-muted-foreground">
            or{" "}
            <span className="font-semibold text-primary underline underline-offset-2">
              browse files
            </span>{" "}
            from your computer
          </p>
        </div>

        <p
          className={cn(
            "text-xs font-medium uppercase tracking-wider",
            lastError ? "text-destructive" : "text-muted-foreground",
          )}
        >
          {helperText}
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-1 bg-muted">
        <div
          className={cn(
            "h-full bg-primary transition-all duration-700",
            disabled ? "w-full" : dragActive ? "w-3/4" : "w-0",
          )}
        />
      </div>
    </section>
  );
}
