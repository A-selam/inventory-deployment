import { apiClient } from "@/lib/api-client";
import type { ApiSuccessResponse, PaginatedResult } from "@/types/api";

export type TransactionReason =
  | "received stock"
  | "sold"
  | "damaged"
  | "audit correction";

export type Transaction = {
  id: string;
  item_id: string;
  quantity_change: number;
  reason: TransactionReason;
  timestamp: string;
  user_id: string;
};

export type TransactionsListQuery = {
  page?: number;
  limit?: number;
  inbound?: boolean;
  outbound?: boolean;
  start_date?: string;
  end_date?: string;
  search?: string;
};

export type TransactionsListData = PaginatedResult<Transaction> & {
  total_movement: number;
  inbound_24h: number;
  outbound_24h: number;
  anomalies: number;
};

export type TransactionsListResponse = ApiSuccessResponse<TransactionsListData>;

export type CreateTransactionRequest = {
  item_id: string;
  quantity_change: number;
  reason: TransactionReason;
};

export type CreateTransactionResult = {
  transaction_id: string;
  updated_stock: number;
};

export type CreateTransactionResponse =
  ApiSuccessResponse<CreateTransactionResult>;

export type TransactionHistoryResponse = ApiSuccessResponse<Transaction[]>;

export async function listTransactions(
  params: TransactionsListQuery,
): Promise<TransactionsListResponse> {
  const res = await apiClient.get("/transactions", { params });
  return res.data as TransactionsListResponse;
}

export async function createTransaction(
  data: CreateTransactionRequest,
): Promise<CreateTransactionResponse> {
  const res = await apiClient.post("/transactions", data);
  return res.data as CreateTransactionResponse;
}

export async function getTransactionHistory(): Promise<TransactionHistoryResponse> {
  const res = await apiClient.get("/transactions/history");
  return res.data as TransactionHistoryResponse;
}
