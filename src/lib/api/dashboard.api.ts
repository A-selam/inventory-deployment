import { apiClient } from "@/lib/api-client";
import type { DashboardData } from "@/types/dashboard";

export async function getDashboardOverview(): Promise<DashboardData> {
  const { data } = await apiClient.get<DashboardData>("/dashboard");

  return {
    ...data,
    recent_transactions: data.recent_transactions.map((transaction) => ({
      ...transaction,
      item_name: transaction.item_name ?? transaction.item,
    })),
  };
}