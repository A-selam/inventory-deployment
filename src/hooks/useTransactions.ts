import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTransaction,
  getTransactionHistory,
  listTransactions,
  type CreateTransactionRequest,
  type CreateTransactionResponse,
  type Transaction,
  type TransactionHistoryResponse,
  type TransactionsListQuery,
  type TransactionsListResponse,
} from "@/lib/transactions";

const transactionsListKey = (params?: TransactionsListQuery) =>
  ["transactions", "list", params ?? {}] as const;
const transactionsHistoryKey = ["transactions", "history"] as const;
type TransactionsRangeQuery = Omit<TransactionsListQuery, "page" | "limit"> & {
  start_date: string;
  end_date: string;
};
const transactionsRangeKey = (params?: TransactionsRangeQuery) =>
  ["transactions", "range", params ?? {}] as const;

export function useTransactionsList(params: TransactionsListQuery) {
  return useQuery<TransactionsListResponse>({
    queryKey: transactionsListKey(params),
    queryFn: () => listTransactions(params),
  });
}

export function useTransactionsListEnabled(
  params: TransactionsListQuery,
  enabled: boolean,
) {
  return useQuery<TransactionsListResponse>({
    queryKey: transactionsListKey(params),
    queryFn: () => listTransactions(params),
    enabled,
  });
}

export function useTransactionsRange(
  params: TransactionsRangeQuery | null,
  enabled: boolean,
) {
  return useQuery<Transaction[]>({
    queryKey: transactionsRangeKey(params ?? undefined),
    enabled,
    queryFn: async () => {
      if (!params) return [];

      const limit = 100;
      const maxPages = 50;
      const all: Transaction[] = [];

      let page = 1;

      for (let i = 0; i < maxPages; i += 1) {
        const response = await listTransactions({ ...params, page, limit });
        const batch = response.data.data ?? [];
        all.push(...batch);

        const totalPages = response.data.total_pages;
        if (typeof totalPages === "number" && page >= totalPages) break;
        if (batch.length < limit) break;

        page += 1;
      }

      return all;
    },
  });
}

export function useTransactionHistory() {
  return useQuery<TransactionHistoryResponse>({
    queryKey: transactionsHistoryKey,
    queryFn: () => getTransactionHistory(),
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation<
    CreateTransactionResponse,
    unknown,
    CreateTransactionRequest
  >({
    mutationFn: (data) => createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}
