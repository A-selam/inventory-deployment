"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useItemsList } from "@/hooks/useItems";
import ItemsHeader from "@/components/items/ItemsHeader";
import ItemsTable from "@/components/items/ItemsTable";
import ItemsFilters from "@/components/items/ItemsFilters";
import type { Item } from "@/lib/items";
// Normalized list rows stay in the API layer; only the item detail shape lives in shared types.

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

function parsePositiveInt(value: string | null, fallback: number) {
  if (!value) return fallback;

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export default function InventoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = parsePositiveInt(searchParams.get("page"), DEFAULT_PAGE);
  const limit = parsePositiveInt(searchParams.get("limit"), DEFAULT_LIMIT);

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

  const { data, isLoading } = useItemsList({ page, limit });

  const itemsData = data?.data;

  const rawItems = itemsData?.data ?? [];
  const mappedItems: Item[] = rawItems.map((it: any) => ({
    id: it.id,
    sku: it.sku,
    name: it.name,
    description: it.description ?? "",
    quantity_on_hand: it.stock ?? it.quantity_on_hand ?? 0,
    minimum_stock_level: it.minimum_stock_level ?? 0,
    cost_price: it.cost_price ?? it.cost ?? 0,
    selling_price: it.selling_price ?? it.selling_price ?? 0,
    category_id: it.category ?? it.category_id ?? "",
    vendor_id: it.vendor ?? it.vendor_id ?? "",
    location: it.Bin_location ?? it.bin_location ?? it.location ?? "",
    is_active: it.is_active ?? true,
    created_at: it.created_at ?? "",
    updated_at: it.updated_at ?? "",
  }));

  const totalPages = itemsData?.total_pages ?? 1;
  const currentPage = Math.min(page, Math.max(totalPages, 1));

  const updatePage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    params.set("limit", String(limit));
    router.push(`/inventory?${params.toString()}`);
  };

  return (
    <div className="space-y-8">
      <ItemsHeader
        activeSkus={itemsData?.active_skus ?? 0}
        belowThreshold={itemsData?.below_threshold ?? 0}
      />

      <ItemsFilters />

      <ItemsTable
        items={mappedItems}
        isLoading={isLoading}
        page={currentPage}
        totalPages={totalPages}
        limit={limit}
        totalItems={itemsData?.total ?? 0}
        onPageChange={updatePage}
      />
    </div>
  );
}
