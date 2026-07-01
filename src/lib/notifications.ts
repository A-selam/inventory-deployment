import { apiClient } from "@/lib/api-client";
import type { ApiSuccessResponse } from "@/types/api";

export type NotificationSeverity = "critical" | "warning";

export type NotificationType = "low_stock" | string;

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  severity: NotificationSeverity;
  is_read: boolean;
  item_id?: string;
  created_at?: string;
};

export type NotificationsResponse = ApiSuccessResponse<Notification[]>;

function isApiSuccessResponse(
  value: unknown,
): value is ApiSuccessResponse<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    (value as { success?: unknown }).success === true &&
    "data" in value
  );
}

export async function getNotifications(): Promise<NotificationsResponse> {
  const res = await apiClient.get("/alerts/notifications");
  const payload = res.data as unknown;

  if (isApiSuccessResponse(payload)) {
    const rawData = (payload as ApiSuccessResponse<unknown>).data;
    return {
      success: true,
      message:
        typeof (payload as { message?: unknown }).message === "string"
          ? ((payload as { message?: string }).message as string)
          : "OK",
      data: Array.isArray(rawData) ? (rawData as Notification[]) : [],
    };
  }

  if (Array.isArray(payload)) {
    return { success: true, message: "OK", data: payload as Notification[] };
  }

  if (typeof payload === "object" && payload !== null) {
    const raw = payload as { data?: unknown; message?: unknown };
    return {
      success: true,
      message: typeof raw.message === "string" ? raw.message : "OK",
      data: Array.isArray(raw.data) ? (raw.data as Notification[]) : [],
    };
  }

  return { success: true, message: "OK", data: [] };
}

export async function getUnreadNotificationsCount(): Promise<number> {
  const res = await apiClient.get("/alerts/notifications/unread_count");
  const payload = res.data as unknown;

  if (typeof payload === "number" && Number.isFinite(payload)) return payload;

  if (typeof payload === "string") {
    const parsed = Number(payload);
    if (Number.isFinite(parsed)) return parsed;
  }

  if (isApiSuccessResponse(payload)) {
    const rawData = (payload as ApiSuccessResponse<unknown>).data;
    if (typeof rawData === "number" && Number.isFinite(rawData)) return rawData;
    if (typeof rawData === "string") {
      const parsed = Number(rawData);
      if (Number.isFinite(parsed)) return parsed;
    }
  }

  if (typeof payload === "object" && payload !== null) {
    const raw = payload as { data?: unknown };
    if (typeof raw.data === "number" && Number.isFinite(raw.data)) return raw.data;
    if (typeof raw.data === "string") {
      const parsed = Number(raw.data);
      if (Number.isFinite(parsed)) return parsed;
    }
  }

  return 0;
}

export async function markNotificationRead(notificationId: string) {
  const res = await apiClient.post(
    `/alerts/notifications/${notificationId}/mark_read`,
  );
  return res.data as unknown;
}

export async function markAllNotificationsRead(): Promise<boolean> {
  const res = await apiClient.post("/alerts/notifications/mark_all_read");
  const payload = res.data as unknown;

  if (typeof payload === "boolean") return payload;

  if (isApiSuccessResponse(payload)) {
    const rawData = (payload as ApiSuccessResponse<unknown>).data;
    return rawData === true;
  }

  if (typeof payload === "object" && payload !== null) {
    const raw = payload as { data?: unknown };
    return raw.data === true;
  }

  return false;
}

