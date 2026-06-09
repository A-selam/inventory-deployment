"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { useCategoriesList } from "@/hooks/useCategories";
import { useVendorsList } from "@/hooks/useVendors";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Card from "@/components/ui/card";

export default function ItemsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoriesQuery = useCategoriesList();
  const vendorsQuery = useVendorsList({
    page: 1,
    limit: 250,
    sort_by: "name",
    sort_dir: "asc",
  });

  const lowStock =
    searchParams.get("low_stock") === "1" ||
    searchParams.get("low_stock") === "true";
  const category = searchParams.get("category") ?? "";
  const vendor = searchParams.get("vendor") ?? "";
  const search = searchParams.get("search") ?? "";

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
    else params.set("low_stock", "true");

    router.push(`/inventory?${params.toString()}`);
  };

  const categories = categoriesQuery.data ?? [];
  const vendors = vendorsQuery.data?.data ?? [];

  return (
    <Card className="rounded-[12px] border-border p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_220px_auto_auto] lg:items-end">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Search
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => updateParam("search", event.target.value || null)}
              placeholder="Search by name or category"
              className="h-11 rounded-[10px] pl-9"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Category
          </label>
          <select
            value={category}
            onChange={(event) => updateParam("category", event.target.value || null)}
            className="h-11 w-full rounded-[10px] border border-input bg-card px-3 text-sm text-foreground outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">
              {categoriesQuery.isLoading ? "Loading categories…" : "All categories"}
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Vendor
          </label>
          <select
            value={vendor}
            onChange={(event) => updateParam("vendor", event.target.value || null)}
            className="h-11 w-full rounded-[10px] border border-input bg-card px-3 text-sm text-foreground outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">
              {vendorsQuery.isLoading ? "Loading vendors…" : "All vendors"}
            </option>
            {vendors.map((vend) => (
              <option key={vend.id} value={vend.id}>
                {vend.name}
              </option>
            ))}
          </select>
        </div>

        <Button
          type="button"
          variant={lowStock ? "default" : "outline"}
          size="sm"
          className="h-11"
          onClick={toggleLowStock}
        >
          Low stock
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-11"
          onClick={() => router.push("/inventory")}
        >
          Clear
        </Button>
      </div>
    </Card>
  );
}
