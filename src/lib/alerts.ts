import { apiClient } from "@/lib/api-client";
import type { ApiSuccessResponse } from "@/types/api";

export type AlertSeverity = "critical" | "warning";

export type Alert = {
  item_name: string;
  stock: number;
  threshold: number;
  severity: AlertSeverity;
};

export type AlertsData = {
  alerts: Alert[];
  total: number;
  page: number;
  limit: number;
};

export type AlertsResponse = ApiSuccessResponse<AlertsData>;

export type AlertsQueryParams = {
  page?: number;
  limit?: number;
};

const emptyAlertsData = (page = 1, limit = 20): AlertsData => ({
  alerts: [],
  total: 0,
  page,
  limit,
});

function normalizeAlertsData(
  value: unknown,
  fallbackPage = 1,
  fallbackLimit = 20,
): AlertsData {
  if (Array.isArray(value)) {
    return {
      alerts: value as Alert[],
      total: value.length,
      page: fallbackPage,
      limit: fallbackLimit,
    };
  }

  if (typeof value !== "object" || value === null) {
    return emptyAlertsData(fallbackPage, fallbackLimit);
  }

  const raw = value as {
    alerts?: unknown;
    total?: unknown;
    page?: unknown;
    limit?: unknown;
  };
  const alerts = Array.isArray(raw.alerts) ? (raw.alerts as Alert[]) : [];
  const page = Number.isFinite(Number(raw.page))
    ? Number(raw.page)
    : fallbackPage;
  const limit = Number.isFinite(Number(raw.limit))
    ? Number(raw.limit)
    : fallbackLimit;
  const total = Number.isFinite(Number(raw.total))
    ? Number(raw.total)
    : alerts.length;

  return { alerts, total, page, limit };
}

export async function getAlerts(
  params: AlertsQueryParams = {},
): Promise<AlertsResponse> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const res = await apiClient.get("/alerts", { params: { page, limit } });
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
      data: normalizeAlertsData(rawData, page, limit),
    };
  }

  if (Array.isArray(payload)) {
    return {
      success: true,
      message: "OK",
      data: normalizeAlertsData(payload, page, limit),
    };
  }

  if (typeof payload === "object" && payload !== null) {
    const raw = payload as { data?: unknown; message?: unknown };
    return {
      success: true,
      message: typeof raw.message === "string" ? raw.message : "OK",
      data: normalizeAlertsData(raw.data ?? payload, page, limit),
    };
  }

  return { success: true, message: "OK", data: emptyAlertsData(page, limit) };
}
