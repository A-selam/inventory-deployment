import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTransaction,
  getTransactionHistory,
  listTransactions,
  type CreateTransactionRequest,
  type CreateTransactionResponse,
  type TransactionHistoryResponse,
  type TransactionsListQuery,
  type TransactionsListResponse,
} from "@/lib/transactions";

const transactionsListKey = (params?: TransactionsListQuery) =>
  ["transactions", "list", params ?? {}] as const;
const transactionsHistoryKey = ["transactions", "history"] as const;

export function useTransactionsList(params: TransactionsListQuery) {
  return useQuery<TransactionsListResponse>({
    queryKey: transactionsListKey(params),
    queryFn: () => listTransactions(params),
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
