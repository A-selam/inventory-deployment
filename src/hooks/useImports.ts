import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getImportHistory,
  importCsv,
  type ImportCsvResponse,
  type ImportHistoryQuery,
  type ImportHistoryResponse,
} from "@/lib/imports";

const importHistoryKey = (params?: ImportHistoryQuery) =>
  ["imports", "history", params ?? {}] as const;

export function useImportHistory(params: ImportHistoryQuery) {
  return useQuery<ImportHistoryResponse>({
    queryKey: importHistoryKey(params),
    queryFn: () => getImportHistory(params),
  });
}

export function useImportCsv() {
  const queryClient = useQueryClient();

  return useMutation<ImportCsvResponse, unknown, File>({
    mutationFn: (file) => importCsv(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["imports"] });
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}
