import { apiClient } from "@/lib/api-client";
import type { ApiSuccessResponse } from "@/types/api";
import type { Transaction } from "@/lib/transactions";

export type StockMovementPoint = {
  month: string;
  movement: number;
};

export type DashboardData = {
  total_items: number;
  low_stock: number;
  inventory_value: number;
  active_vendors: number;
  stock_movement_chart: StockMovementPoint[];
  recent_transactions: Transaction[];
};

export type DashboardResponse = ApiSuccessResponse<DashboardData>;

export type DashboardSearchResult = {
  items: Array<{ id: string; sku: string; name: string }>;
  vendors: Array<{ id: string; name: string }>;
};

export type DashboardSearchResponse = ApiSuccessResponse<DashboardSearchResult>;

export async function getDashboard(): Promise<DashboardResponse> {
  const res = await apiClient.get("/dashboard");
  return res.data as DashboardResponse;
}

export async function searchDashboard(
  query: string,
): Promise<DashboardSearchResponse> {
  const res = await apiClient.get("/dashboard/search", {
    params: { q: query },
  });
  return res.data as DashboardSearchResponse;
}
