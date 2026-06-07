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

export async function getReplenishment(
  params: ReplenishmentQuery,
): Promise<ReplenishmentResponse> {
  const res = await apiClient.get("/replenishment", { params });
  return res.data as ReplenishmentResponse;
}
