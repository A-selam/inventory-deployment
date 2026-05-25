import axios from "axios";
import type { ApiErrorResponse } from "@/types/api";

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong",
) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    if (data?.error?.message) {
      return data.error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
