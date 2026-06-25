import { apiClient } from "@/lib/api-client";

type ApiSuccessEnvelope<T> = {
  success: true;
  data: T;
};

function unwrapSuccessEnvelope<T>(payload: unknown): unknown {
  if (!payload || typeof payload !== "object") return payload;
  if (!("success" in payload) || (payload as { success?: unknown }).success !== true)
    return payload;
  if (!("data" in payload)) return payload;
  return (payload as ApiSuccessEnvelope<T>).data;
}

export type ImportCsvError = {
  row: number;
  field: string;
  message: string;
};

export type ImportCsvResult =
  | {
      status: "success" | string;
      records: number;
    }
  | {
      status: "failed" | string;
      errors: ImportCsvError[];
    };

export type ImportHistoryEntry = {
  file_name: string;
  date: string;
  records: number;
  status: string;
  file_link?: string | null;
};

export type ImportHistoryQuery = {
  page?: number;
  limit?: number;
  search?: string;
};

export async function importCsv(file: File): Promise<ImportCsvResult> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await apiClient.post("/imports/csv", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  const raw = unwrapSuccessEnvelope(res.data);
  if (!raw || typeof raw !== "object") {
    return { status: "failed", errors: [{ row: 0, field: "", message: "Invalid response" }] };
  }

  const status =
    typeof (raw as { status?: unknown }).status === "string"
      ? ((raw as { status: string }).status as string)
      : "failed";

  if (status === "success") {
    const records =
      typeof (raw as { records?: unknown }).records === "number"
        ? (raw as { records: number }).records
        : 0;
    return { status, records };
  }

  const errorsRaw = (raw as { errors?: unknown }).errors;
  const errors = Array.isArray(errorsRaw)
    ? errorsRaw
        .map((entry): ImportCsvError | null => {
          if (!entry || typeof entry !== "object") return null;
          const row =
            typeof (entry as { row?: unknown }).row === "number"
              ? (entry as { row: number }).row
              : 0;
          const field =
            typeof (entry as { field?: unknown }).field === "string"
              ? (entry as { field: string }).field
              : "";
          const message =
            typeof (entry as { message?: unknown }).message === "string"
              ? (entry as { message: string }).message
              : "Invalid row";
          return { row, field, message };
        })
        .filter((entry): entry is ImportCsvError => Boolean(entry))
    : [];

  return { status, errors };
}

export async function getImportHistory(
  params: ImportHistoryQuery,
): Promise<ImportHistoryEntry[]> {
  const res = await apiClient.get("/imports/history", { params });
  const raw = unwrapSuccessEnvelope(res.data);

  if (Array.isArray(raw)) {
    return raw
      .map((entry): ImportHistoryEntry | null => {
        if (!entry || typeof entry !== "object") return null;
        const file_name =
          typeof (entry as { file_name?: unknown }).file_name === "string"
            ? (entry as { file_name: string }).file_name
            : "";
        const date =
          typeof (entry as { date?: unknown }).date === "string"
            ? (entry as { date: string }).date
            : "";
        const records =
          typeof (entry as { records?: unknown }).records === "number"
            ? (entry as { records: number }).records
            : 0;
        const status =
          typeof (entry as { status?: unknown }).status === "string"
            ? (entry as { status: string }).status
            : "";
        const file_link =
          typeof (entry as { file_link?: unknown }).file_link === "string"
            ? (entry as { file_link: string }).file_link
            : null;

        return { file_name, date, records, status, file_link };
      })
      .filter((entry): entry is ImportHistoryEntry => Boolean(entry?.file_name));
  }

  return [];
}
