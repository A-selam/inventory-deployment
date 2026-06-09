import { apiClient } from "@/lib/api-client";
import type { ApiSuccessResponse, PaginatedResult } from "@/types/api";

export type TransactionReason =
  | "received stock"
  | "sold"
  | "damaged"
  | "audit correction";

export type Transaction = {
  id: string;
  quantity_change: number;
  item?: string;
  item_name?: string;
  sku?: string;
  transaction_type?: "inbound" | "outbound" | string;
  item_id?: string;
  reason?: TransactionReason | string;
  created_at?: string;
  timestamp?: string;
  operator_name?: string;
  Opratore_name?: string;
  user_id?: string;
  before_quantity?: number;
  after_quantity?: number;
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

export type TransactionsListData = Partial<
  Pick<PaginatedResult<Transaction>, "total" | "page" | "limit" | "total_pages">
> & {
  total_movement: number;
  inbound_24h: number;
  outbound_24h: number;
  anomalies: number;
  data: Transaction[];
};

export type TransactionsListResponse = ApiSuccessResponse<TransactionsListData>;

export type TransactionType = "inbound" | "outbound";

export type CreateTransactionRequest = {
  item_id: string;
  transaction_type: TransactionType;
  quantity_change: number;
};

export type CreateTransactionResult = {
  transaction_id: string;
  updated_stock: number;
};

export type CreateTransactionResponse =
  ApiSuccessResponse<CreateTransactionResult>;

export type TransactionHistoryResponse = ApiSuccessResponse<Transaction[]>;

function isApiSuccessResponse(value: unknown): value is ApiSuccessResponse<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    (value as { success?: unknown }).success === true &&
    "data" in value
  );
}

export async function listTransactions(
  params: TransactionsListQuery,
): Promise<TransactionsListResponse> {
  const res = await apiClient.get("/transactions", { params });
  const payload = res.data as unknown;

  if (isApiSuccessResponse(payload)) {
    return payload as TransactionsListResponse;
  }

  if (Array.isArray(payload)) {
    return {
      success: true,
      message: "OK",
      data: {
        total_movement: 0,
        inbound_24h: 0,
        outbound_24h: 0,
        anomalies: 0,
        data: payload as Transaction[],
      },
    };
  }

  if (typeof payload === "object" && payload !== null) {
    const raw = payload as Partial<TransactionsListData>;
    const rawData = (raw as { data?: unknown }).data;

    return {
      success: true,
      message: "OK",
      data: {
        total: typeof raw.total === "number" ? raw.total : undefined,
        page: typeof raw.page === "number" ? raw.page : undefined,
        limit: typeof raw.limit === "number" ? raw.limit : undefined,
        total_pages:
          typeof raw.total_pages === "number" ? raw.total_pages : undefined,
        total_movement: typeof raw.total_movement === "number" ? raw.total_movement : 0,
        inbound_24h: typeof raw.inbound_24h === "number" ? raw.inbound_24h : 0,
        outbound_24h: typeof raw.outbound_24h === "number" ? raw.outbound_24h : 0,
        anomalies: typeof raw.anomalies === "number" ? raw.anomalies : 0,
        data: Array.isArray(rawData) ? (rawData as Transaction[]) : [],
      },
    };
  }

  return {
    success: true,
    message: "OK",
    data: {
      total_movement: 0,
      inbound_24h: 0,
      outbound_24h: 0,
      anomalies: 0,
      data: [],
    },
  };
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
