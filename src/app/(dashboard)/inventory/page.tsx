"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useItemsList } from "@/hooks/useItems";
import ItemsHeader from "@/components/items/ItemsHeader";
import ItemsTable from "@/components/items/ItemsTable";

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
      <ItemsHeader />

      <ItemsTable
        items={itemsData?.data || []}
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
