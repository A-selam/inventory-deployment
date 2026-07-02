"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { useCategoriesList } from "@/hooks/useCategories";
import { useVendorsList } from "@/hooks/useVendors";
import Button from "@/components/ui/button";
import Label from "@/components/ui/label";

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
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-[220px_220px_auto_auto] lg:items-end">
      <div>
        <Label className="mb-1 text-[11px]">Category</Label>
        <select
          value={category}
          onChange={(event) => updateParam("category", event.target.value || null)}
          className="h-9 w-full rounded-md border border-input bg-card px-2 text-sm text-foreground outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
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
        <Label className="mb-1 text-[11px]">Vendor</Label>
        <select
          value={vendor}
          onChange={(event) => updateParam("vendor", event.target.value || null)}
          className="h-9 w-full rounded-md border border-input bg-card px-2 text-sm text-foreground outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
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
        className="h-9"
        onClick={toggleLowStock}
      >
        Low stock
      </Button>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-9"
        onClick={() => router.push("/inventory")}
      >
        Clear
      </Button>
    </div>
  );
}
