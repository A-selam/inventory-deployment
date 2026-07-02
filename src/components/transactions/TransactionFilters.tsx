"use client";

import { useRouter, useSearchParams } from "next/navigation";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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

  const inbound = searchParams.get("inbound") === "1";
  const outbound = searchParams.get("outbound") === "1";
  const startDate = searchParams.get("start_date") ?? "";
  const endDate = searchParams.get("end_date") ?? "";

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
    <div className="flex flex-col gap-2 lg:flex-row lg:items-end">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={inbound ? "default" : "outline"}
          size="sm"
          className="h-8"
          onClick={toggleInbound}
        >
          Inbound
        </Button>
        <Button
          type="button"
          variant={outbound ? "default" : "outline"}
          size="sm"
          className="h-8"
          onClick={toggleOutbound}
        >
          Outbound
        </Button>
      </div>

      <div className="grid flex-1 gap-2 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
            Start date
          </label>
          <Input
            type="date"
            className="h-8 text-sm"
            value={startDate}
            onChange={(event) =>
              updateParam("start_date", event.target.value || null)
            }
          />
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
            End date
          </label>
          <Input
            type="date"
            className="h-8 text-sm"
            value={endDate}
            onChange={(event) => updateParam("end_date", event.target.value || null)}
          />
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8"
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
