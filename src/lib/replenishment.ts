import { apiClient } from "@/lib/api-client";
import type { ApiSuccessResponse } from "@/types/api";

export type ReplenishmentItem = {
  id: string;
  sku: string;
  name: string;
  current_stock: number;
  threshold: number;
  reorder_quantity: number;
  cost_price: number;
  vendor_id: string;
  category_id: string;
};

export type ReplenishmentData = {
  total_reorder_value: number;
  out_of_stock: number;
  pending_order: number;
  critical_low_stock: number;
  items: ReplenishmentItem[];
};

export type ReplenishmentReportEntry = {
  vendor_id: string;
  vendor_name: string;
  items_count: number;
  total_reorder_value: number;
};

export type ReplenishmentQuery = {
  category?: string;
  search?: string;
};

export type ReplenishmentResponse = ApiSuccessResponse<ReplenishmentData>;

export type ReplenishmentReportResponse = ApiSuccessResponse<
  ReplenishmentReportEntry[]
>;

export async function getReplenishment(
  params: ReplenishmentQuery,
): Promise<ReplenishmentResponse> {
  const res = await apiClient.get("/replenishment", { params });
  return res.data as ReplenishmentResponse;
}

export async function getReplenishmentReport(): Promise<ReplenishmentReportResponse> {
  const res = await apiClient.get("/replenishment/report");
  return res.data as ReplenishmentReportResponse;
}
