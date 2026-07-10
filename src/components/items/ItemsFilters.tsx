"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Search } from "lucide-react";

import { useCategoriesList } from "@/hooks/useCategories";
import { useVendorsList } from "@/hooks/useVendors";
import Button from "@/components/ui/button";
import Label from "@/components/ui/label";

const DEFAULT_LIMIT = 20;

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
  const limit = searchParams.get("limit") ?? String(DEFAULT_LIMIT);

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
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-[220px_220px_200px_100px_auto_auto] lg:items-end">
      <div>
        <Label className="mb-1 text-[11px]">Search</Label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(event) => updateParam("search", event.target.value || null)}
            placeholder="Search items..."
            className="h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-3 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          />
        </div>
      </div>
      
      <div>
        <Label className="mb-1 text-[11px]">Category</Label>
        <div className="relative">
          <select
            value={category}
            onChange={(event) =>
              updateParam("category", event.target.value || null)
            }
            className="h-9 w-full appearance-none rounded-md border border-input bg-transparent px-3 pr-9 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          >
            <option value="">
              {categoriesQuery.isLoading
                ? "Loading categories…"
                : "All categories"}
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      <div>
        <Label className="mb-1 text-[11px]">Supplier</Label>
        <div className="relative">
          <select
            value={vendor}
            onChange={(event) =>
              updateParam("vendor", event.target.value || null)
            }
            className="h-9 w-full appearance-none rounded-md border border-input bg-transparent px-3 pr-9 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          >
            <option value="">
              {vendorsQuery.isLoading ? "Loading suppliers…" : "All suppliers"}
            </option>
            {vendors.map((vend) => (
              <option key={vend.id} value={vend.id}>
                {vend.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
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
