"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useSanitizedSearch } from "@/hooks/useSanitizedSearch";

const DEFAULT_LIMIT = 20;

type TransactionFiltersProps = {
  variant?: "card" | "panel";
  className?: string;
};

export default function TransactionFilters({
  variant = "card",
  className,
}: TransactionFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { sanitizeSearch } = useSanitizedSearch();

  const inbound = searchParams.get("inbound") === "1";
  const outbound = searchParams.get("outbound") === "1";
  const startDate = searchParams.get("start_date") ?? "";
  const endDate = searchParams.get("end_date") ?? "";
  const search = searchParams.get("search") ?? "";
  const limit = searchParams.get("limit") ?? String(DEFAULT_LIMIT);

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");

    if (!value) params.delete(key);
    else params.set(key, value);

    router.push(`/transactions?${params.toString()}`);
  };

  const toggleInbound = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");

    if (inbound) params.delete("inbound");
    else {
      params.set("inbound", "1");
      params.delete("outbound");
    }

    router.push(`/transactions?${params.toString()}`);
  };

  const toggleOutbound = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");

    if (outbound) params.delete("outbound");
    else {
      params.set("outbound", "1");
      params.delete("inbound");
    }

    router.push(`/transactions?${params.toString()}`);
  };

  const content = (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
      <div>
        <Label className="mb-1 text-[11px]">Search</Label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(event) => {
              const sanitized = sanitizeSearch(event.target.value || "");
              updateParam("search", sanitized || null);
            }}
            placeholder="Search transactions..."
            className="h-9 w-full min-w-[200px] rounded-md border border-input bg-transparent pl-9 pr-3 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={inbound ? "default" : "outline"}
          size="sm"
          className="h-9"
          onClick={toggleInbound}
        >
          Inbound
        </Button>
        <Button
          type="button"
          variant={outbound ? "default" : "outline"}
          size="sm"
          className="h-9"
          onClick={toggleOutbound}
        >
          Outbound
        </Button>
      </div>

      <div className="grid flex-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <Label className="mb-1 text-[11px]">Start date</Label>
          <Input
            type="date"
            className="h-9 text-sm"
            value={startDate}
            onChange={(event) =>
              updateParam("start_date", event.target.value || null)
            }
          />
        </div>
        <div>
          <Label className="mb-1 text-[11px]">End date</Label>
          <Input
            type="date"
            className="h-9 text-sm"
            value={endDate}
            onChange={(event) => updateParam("end_date", event.target.value || null)}
          />
        </div>
        <div>
          <Label className="mb-1 text-[11px]">Limit</Label>
          <input
            type="number"
            min={1}
            max={100}
            value={limit}
            onChange={(event) => updateParam("limit", event.target.value || null)}
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          />
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-9"
        onClick={() => router.push("/transactions")}
      >
        Clear
      </Button>
    </div>
  );

  if (variant === "panel") {
    return <div className={cn(className)}>{content}</div>;
  }

  return (
    <Card className={cn("rounded-[12px] border-border p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]", className)}>
      {content}
    </Card>
  );
}
