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
  const payload = res.data as unknown;

  const isApiSuccessResponse = (
    value: unknown,
  ): value is ApiSuccessResponse<unknown> => {
    return (
      typeof value === "object" &&
      value !== null &&
      "success" in value &&
      (value as { success?: unknown }).success === true &&
      "data" in value
    );
  };

  if (isApiSuccessResponse(payload)) {
    const rawData = (payload as ApiSuccessResponse<unknown>).data;
    return {
      success: true,
      message:
        typeof (payload as { message?: unknown }).message === "string"
          ? ((payload as { message?: string }).message as string)
          : "OK",
      data: Array.isArray(rawData) ? (rawData as Alert[]) : [],
    };
  }

  if (Array.isArray(payload)) {
    return { success: true, message: "OK", data: payload as Alert[] };
  }

  if (typeof payload === "object" && payload !== null) {
    const raw = payload as { data?: unknown; message?: unknown };
    return {
      success: true,
      message: typeof raw.message === "string" ? raw.message : "OK",
      data: Array.isArray(raw.data) ? (raw.data as Alert[]) : [],
    };
  }

  return { success: true, message: "OK", data: [] };
}
