import { apiClient } from "@/lib/api-client";

export type CategorySummary = {
  id?: string;
  name?: string;
};

export type CategoryTotalItem = {
  category_id?: string;
  category?: string;
  name?: string;
  total_items?: number;
  qty?: number;
  value?: number;
};

function toNumber(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function extractTotal(payload: unknown): number {
  if (!payload || typeof payload !== "object") return 0;

  const record = payload as {
    total_items?: unknown;
    totalItems?: unknown;
    data?: unknown;
    items?: unknown;
    value?: unknown;
  };

  if (typeof record.total_items === "number" || typeof record.total_items === "string") {
    return toNumber(record.total_items);
  }

  if (typeof record.totalItems === "number" || typeof record.totalItems === "string") {
    return toNumber(record.totalItems);
  }

  if (record.data && typeof record.data === "object") {
    const dataRecord = record.data as { total_items?: unknown; totalItems?: unknown; value?: unknown };
    if (typeof dataRecord.total_items === "number" || typeof dataRecord.total_items === "string") {
      return toNumber(dataRecord.total_items);
    }
    if (typeof dataRecord.totalItems === "number" || typeof dataRecord.totalItems === "string") {
      return toNumber(dataRecord.totalItems);
    }
    if (typeof dataRecord.value === "number" || typeof dataRecord.value === "string") {
      return toNumber(dataRecord.value);
    }
  }

  if (Array.isArray(record.items)) {
    return record.items.reduce((sum, item) => {
      if (!item || typeof item !== "object") return sum;
      const current = item as CategoryTotalItem;
      return sum + toNumber(current.total_items ?? current.qty ?? current.value ?? 0);
    }, 0);
  }

  return 0;
}

export async function getCategoryItemTotals(): Promise<{
  totalItems: number;
  data: Array<{ name: string; value: number }>;
}> {
  const [overallRes, categoriesRes] = await Promise.all([
    apiClient.get("/categories/total-items"),
    apiClient.get("/categories"),
  ]);

  const overallTotal = extractTotal(overallRes.data);

  const categoriesPayload = (categoriesRes.data ?? {}) as {
    data?: CategorySummary[];
    items?: CategorySummary[];
    categories?: CategorySummary[];
  };

  const categories = Array.isArray(categoriesPayload.data)
    ? categoriesPayload.data
    : Array.isArray(categoriesPayload.items)
      ? categoriesPayload.items
      : Array.isArray(categoriesPayload.categories)
        ? categoriesPayload.categories
        : [];

  const perCategoryData = await Promise.all(
    categories.map(async (category) => {
      if (!category?.id) return null;

      const res = await apiClient.get(`/categories/${category.id}/total-items`);
      const value = extractTotal(res.data);
      return {
        name: category.name ?? "Unnamed category",
        value: Math.max(0, value),
      };
    }),
  );

  const data = perCategoryData.filter(
    (entry): entry is { name: string; value: number } =>
      entry !== null && entry !== undefined && entry.value > 0,
  );

  const totalItems = overallTotal > 0 ? overallTotal : data.reduce((sum, entry) => sum + entry.value, 0);

  return { totalItems, data };
}
