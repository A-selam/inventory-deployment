import { apiClient } from "@/lib/api-client";
import type { ApiSuccessResponse } from "@/types/api";

export type ReplenishmentItem = {
  item_name: string;
  sku: string;
  current_stock: number;
  threshold: number;
  qty_needed: number;
  estimated_cost: number;
};

export type ReplenishmentItemsByVendor = Record<string, ReplenishmentItem[]>;

export type ReplenishmentData = {
  total_reorder_value: number;
  out_of_stock: number;
  pending_order: number;
  critical_low_stock: number;
  items_grouped_by_vendor: ReplenishmentItemsByVendor;
};

export type ReplenishmentQuery = {
  category?: string;
  search?: string;
};

export type ReplenishmentResponse = ApiSuccessResponse<ReplenishmentData>;

function isApiSuccessResponse(value: unknown): value is ApiSuccessResponse<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    (value as { success?: unknown }).success === true &&
    "data" in value
  );
}

function normalizeItem(value: unknown): ReplenishmentItem | null {
  if (typeof value !== "object" || value === null) return null;
  const raw = value as Partial<ReplenishmentItem>;

  if (typeof raw.item_name !== "string" || typeof raw.sku !== "string") {
    return null;
  }

  return {
    item_name: raw.item_name,
    sku: raw.sku,
    current_stock: typeof raw.current_stock === "number" ? raw.current_stock : 0,
    threshold: typeof raw.threshold === "number" ? raw.threshold : 0,
    qty_needed: typeof raw.qty_needed === "number" ? raw.qty_needed : 0,
    estimated_cost:
      typeof raw.estimated_cost === "number" ? raw.estimated_cost : 0,
  };
}

function normalizeItemsByVendor(value: unknown): ReplenishmentItemsByVendor {
  if (typeof value !== "object" || value === null) return {};
  const entries = Object.entries(value as Record<string, unknown>);

  return entries.reduce<ReplenishmentItemsByVendor>((acc, [vendor, items]) => {
    if (!Array.isArray(items)) return acc;
    const normalizedItems = items
      .map(normalizeItem)
      .filter((item): item is ReplenishmentItem => item !== null);
    acc[vendor] = normalizedItems;
    return acc;
  }, {});
}

export async function getReplenishment(
  params: ReplenishmentQuery,
): Promise<ReplenishmentResponse> {
  const res = await apiClient.get("/replenishment", { params });
  const payload = res.data as unknown;

  if (isApiSuccessResponse(payload)) {
    return payload as ReplenishmentResponse;
  }

  if (typeof payload === "object" && payload !== null) {
    const raw = payload as Partial<ReplenishmentData> & {
      items_grouped_by_vendor?: unknown;
    };

    return {
      success: true,
      message: "OK",
      data: {
        total_reorder_value:
          typeof raw.total_reorder_value === "number" ? raw.total_reorder_value : 0,
        out_of_stock: typeof raw.out_of_stock === "number" ? raw.out_of_stock : 0,
        pending_order:
          typeof raw.pending_order === "number" ? raw.pending_order : 0,
        critical_low_stock:
          typeof raw.critical_low_stock === "number" ? raw.critical_low_stock : 0,
        items_grouped_by_vendor: normalizeItemsByVendor(
          raw.items_grouped_by_vendor,
        ),
      },
    };
  }

  return {
    success: true,
    message: "OK",
    data: {
      total_reorder_value: 0,
      out_of_stock: 0,
      pending_order: 0,
      critical_low_stock: 0,
      items_grouped_by_vendor: {},
    },
  };
}
