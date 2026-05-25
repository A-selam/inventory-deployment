import { apiClient } from "@/lib/api-client";
import type { ApiSuccessResponse, PaginatedResult } from "@/types/api";

export type ImportResult = {
  status: string;
  records: number;
};

export type ImportCsvResponse = ApiSuccessResponse<ImportResult>;

export type ImportHistoryEntry = {
  id: string;
  filename: string;
  status: string;
  records: number;
  errors: string[];
  timestamp: string;
};

export type ImportHistoryQuery = {
  page?: number;
  limit?: number;
  search?: string;
};

export type ImportHistoryResponse = ApiSuccessResponse<
  PaginatedResult<ImportHistoryEntry>
>;

export async function importCsv(file: File): Promise<ImportCsvResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await apiClient.post("/imports/csv", formData);
  return res.data as ImportCsvResponse;
}

export async function getImportHistory(
  params: ImportHistoryQuery,
): Promise<ImportHistoryResponse> {
  const res = await apiClient.get("/imports/history", { params });
  return res.data as ImportHistoryResponse;
}
