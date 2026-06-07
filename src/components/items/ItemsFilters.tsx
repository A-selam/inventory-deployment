"use client";

import { useRouter, useSearchParams } from "next/navigation";

import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Card from "@/components/ui/card";

export default function ItemsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const lowStock = searchParams.get("low_stock") === "1";
  const category = searchParams.get("category") ?? "";
  const vendor = searchParams.get("vendor") ?? "";

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");

    if (!value) params.delete(key);
    else params.set(key, value);

    router.push(`/inventory?${params.toString()}`);
  };

  const toggleLowStock = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");

    if (lowStock) params.delete("low_stock");
    else params.set("low_stock", "1");

    router.push(`/inventory?${params.toString()}`);
  };

  return (
    <Card className="rounded-[12px] border-border p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant={lowStock ? "default" : "outline"}
            size="sm"
            onClick={toggleLowStock}
          >
            Low stock
          </Button>
        </div>

        <div className="grid flex-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Category
            </label>
            <Input
              value={category}
              onChange={(e) => updateParam("category", e.target.value || null)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Vendor
            </label>
            <Input
              value={vendor}
              onChange={(e) => updateParam("vendor", e.target.value || null)}
            />
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => router.push("/inventory")}
        >
          Clear filters
        </Button>
      </div>
    </Card>
  );
}
