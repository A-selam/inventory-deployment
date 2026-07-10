"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useItemsList } from "@/hooks/useItems";
import ItemsTable from "@/components/items/ItemsTable";
import ItemsFilters from "@/components/items/ItemsFilters";
import CreateItemDrawer from "@/components/items/create-item/CreateItemDrawer";
import type { Item } from "@/lib/items";
// Normalized list rows stay in the API layer; only the item detail shape lives in shared types.

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

type RawItem = Partial<{
  id: string;
  sku: string;
  name: string;
  description: string | null;
  stock: number;
  quantity_on_hand: number;
  minimum_stock_level: number;
  cost_price: number;
  cost: number;
  selling_price: number;
  category: string;
  category_id: string;
  vendor: string;
  vendor_id: string;
  Bin_location: string;
  bin_location: string;
  location: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  status: string;
}>;

function parsePositiveInt(value: string | null, fallback: number) {
  if (!value) return fallback;

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseBoolean(value: string | null) {
  if (!value) return false;
  return value === "true" || value === "1";
}

export default function InventoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [createItemOpen, setCreateItemOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(() => {
    const category = searchParams.get("category") ?? "";
    const vendor = searchParams.get("vendor") ?? "";
    const lowStock = parseBoolean(searchParams.get("low_stock"));
    const search = searchParams.get("search") ?? "";
    return Boolean(category || vendor || lowStock || search);
  });

  const page = parsePositiveInt(searchParams.get("page"), DEFAULT_PAGE);
  const limit = parsePositiveInt(searchParams.get("limit"), DEFAULT_LIMIT);
  const category = searchParams.get("category") ?? "";
  const vendor = searchParams.get("vendor") ?? "";
  const lowStock = parseBoolean(searchParams.get("low_stock"));
  const search = searchParams.get("search") ?? "";

  useEffect(() => {
    const normalizedPage = searchParams.get("page");
    const normalizedLimit = searchParams.get("limit");

    if (normalizedPage === String(page) && normalizedLimit === String(limit)) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    params.set("limit", String(limit));

    router.replace(`/inventory?${params.toString()}`);
  }, [limit, page, router, searchParams]);

  const { data, isLoading } = useItemsList({
    page,
    limit,
    category: category || undefined,
    vendor: vendor || undefined,
    low_stock: lowStock ? true : undefined,
    search: search || undefined,
  });

  const itemsData = data?.data;

  const rawItems = (itemsData?.data ?? []) as RawItem[];
  const mappedItems: Item[] = rawItems.map((it) => ({
    id: it.id ?? "",
    sku: it.sku ?? "",
    name: it.name ?? "",
    description: it.description ?? "",
    quantity_on_hand: it.stock ?? it.quantity_on_hand ?? 0,
    minimum_stock_level: it.minimum_stock_level ?? 0,
    cost_price: it.cost_price ?? it.cost ?? 0,
    selling_price: it.selling_price ?? 0,
    category_id: it.category ?? it.category_id ?? "",
    vendor_id: it.vendor ?? it.vendor_id ?? "",
    bin_location: it.Bin_location ?? it.bin_location ?? it.location ?? "",
    is_active: it.is_active ?? true,
    created_at: it.created_at ?? "",
    status: it.status ?? "unknown",
  }));

  const totalItems = itemsData?.total ?? 0;
  const totalPages =
    itemsData?.total_pages ??
    Math.max(1, Math.ceil(totalItems / Math.max(1, limit)));
  const currentPage = Math.min(page, Math.max(totalPages, 1));

  const updatePage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    params.set("limit", String(limit));
    router.push(`/inventory?${params.toString()}`);
  };

  return (
    <div className="space-y-8">
      <ItemsTable
        items={mappedItems}
        isLoading={isLoading}
        page={currentPage}
        totalPages={totalPages}
        limit={limit}
        totalItems={totalItems}
        filtersOpen={filtersOpen}
        onToggleFilters={() => setFiltersOpen((prev) => !prev)}
        filters={<ItemsFilters />}
        onImport={() => router.push("/imports")}
        onAddItem={() => setCreateItemOpen(true)}
        onPageChange={updatePage}
      />

      <CreateItemDrawer
        open={createItemOpen}
        onClose={() => setCreateItemOpen(false)}
      />
    </div>
  );
}
