import { apiClient } from "@/lib/api-client";
import type { ApiSuccessResponse } from "@/types/api";
import type { DashboardData } from "@/types/dashboard";

export type DashboardResponse = ApiSuccessResponse<DashboardData>;

export type DashboardSearchResult = {
  inventory: Array<{ id: string; sku: string; name: string; qty: number }>;
  vendors: Array<{ id: string; name: string; email: string }>;
};

export type DashboardSearchResponse = ApiSuccessResponse<DashboardSearchResult>;

export async function getDashboard(): Promise<DashboardResponse> {
  const res = await apiClient.get<DashboardResponse>("/dashboard");
  return res.data;
}

export async function getDashboardOverview(): Promise<DashboardData> {
  const response = await getDashboard();
  const data = response.data;

  return {
    ...data,
    recent_transactions: data.recent_transactions.map((transaction) => ({
      ...transaction,
      transaction_type:
        transaction.transaction_type ??
        (transaction as { reason?: string }).reason ??
        "",
      item_name: transaction.item_name ?? transaction.item,
      created_at:
        transaction.created_at ??
        ("timestamp" in transaction
          ? String(
              (transaction as { timestamp?: string | number }).timestamp ?? "",
            )
          : ""),
    })),
  };
}

export async function searchDashboard(
  query: string,
): Promise<DashboardSearchResponse> {
  const res = await apiClient.get("/dashboard/search", {
    params: { q: query },
  });
  return res.data as DashboardSearchResponse;
}
