import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getImportHistory,
  importCsv,
  type ImportCsvResult,
  type ImportHistoryQuery,
  type ImportHistoryEntry,
} from "@/lib/imports";

const importHistoryKey = (params?: ImportHistoryQuery) =>
  ["imports", "history", params ?? {}] as const;

export function useImportHistory(params: ImportHistoryQuery) {
  return useQuery<ImportHistoryEntry[]>({
    queryKey: importHistoryKey(params),
    queryFn: () => getImportHistory(params),
  });
}

export function useImportCsv() {
  const queryClient = useQueryClient();

  return useMutation<ImportCsvResult, unknown, File>({
    mutationFn: (file) => importCsv(file),
    onSuccess: (result) => {
      if (result.status !== "success") return;
      queryClient.invalidateQueries({ queryKey: ["imports"] });
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}
