import axios from "axios";
import type { ApiErrorResponse } from "@/types/api";

function pickFirstString(...values: Array<unknown>) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong",
) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as unknown;

    if (data && typeof data === "object") {
      const legacy = data as ApiErrorResponse;
      const detail = (data as { detail?: unknown }).detail as
        | {
            success?: boolean;
            error?: { code?: string; message?: unknown } | undefined;
            message?: unknown;
          }
        | string
        | undefined;

      const message = pickFirstString(
        legacy?.error?.message,
        typeof detail === "string" ? detail : undefined,
        typeof detail === "object" && detail !== null
          ? detail.error?.message
          : undefined,
        typeof detail === "object" && detail !== null
          ? detail.message
          : undefined,
        (data as { message?: unknown }).message,
        (data as { error?: { message?: unknown } }).error?.message,
      );

      if (message) return message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
