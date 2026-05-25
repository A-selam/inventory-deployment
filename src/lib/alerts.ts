import { apiClient } from "@/lib/api-client";
import type { ApiSuccessResponse } from "@/types/api";

export type AlertSeverity = "critical" | "warning";

export type Alert = {
  item_name: string;
  stock: number;
  threshold: number;
  severity: AlertSeverity;
};

export type AlertsResponse = ApiSuccessResponse<Alert[]>;

export async function getAlerts(): Promise<AlertsResponse> {
  const res = await apiClient.get("/alerts");
  return res.data as AlertsResponse;
}
