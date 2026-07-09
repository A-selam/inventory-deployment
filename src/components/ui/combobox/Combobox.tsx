"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";

import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type ComboboxOption = {
  value: string;
  label: string;
};

type ComboboxProps = {
  label?: string;
  value: string;
  options: ComboboxOption[];
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  onChange: (value: string) => void;
};

export default function Combobox({
  label,
  value,
  options,
  placeholder = "Select…",
  disabled = false,
  loading = false,
  error,
  onChange,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const selectedOption = useMemo(
    () => options.find((o) => o.value === value),
    [options, value],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      const el = wrapperRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setOpen(false);
    };

    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  useEffect(() => {
    // When value changes externally, clear query.
    setQuery("");
  }, [value]);

  const selectValue = (next: string) => {
    onChange(next);
    setOpen(false);
  };

  return (
    <div className="space-y-1.5" ref={wrapperRef}>
      {label ? (
        <div className="label-caps text-foreground">{label}</div>
      ) : null}

      <div className="relative">
        <Input
          ref={inputRef}
          value={open ? query : selectedOption?.label ?? ""}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          onFocus={() => {
            if (disabled) return;
            setOpen(true);
          }}
          onClick={() => {
            if (disabled) return;
            setOpen(true);
          }}
          onChange={(e) => {
            if (disabled) return;
            setQuery(e.target.value);
            setOpen(true);
          }}
        />

        {/* clear button */}
        {value ? (
          <Button
            type="button"
            variant="ghost"
            className="absolute right-7 top-1/2 h-7 -translate-y-1/2 p-0 text-muted-foreground hover:bg-transparent"
            onClick={() => selectValue("")}
            disabled={disabled}
          >
            <X className="size-4" />
          </Button>
        ) : null}

        <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
          <ChevronDown className="size-4" />
        </div>

        {open ? (
          <div
            className={cn(
              "absolute z-20 mt-1 w-full overflow-hidden rounded-md border border-border bg-card shadow-lg",
              disabled ? "hidden" : "block",
            )}
          >
            <div className="max-h-60 overflow-auto">
              {loading ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">Loading…</div>
              ) : filtered.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">No results</div>
              ) : (
                filtered.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      className={cn(
                        "flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-muted",
                        isSelected ? "bg-muted" : "bg-transparent",
                      )}
                      onClick={() => selectValue(opt.value)}
                    >
                      <span className="truncate">{opt.label}</span>
                      {isSelected ? <Check className="size-4 text-foreground" /> : null}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        ) : null}
      </div>

      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

