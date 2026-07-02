import { apiClient } from "@/lib/api-client";
import type { ApiSuccessResponse, PaginatedResult } from "@/types/api";
import type { ItemDetail } from "@/types/items";

export type Item = {
  id: string;
  sku: string;
  name: string;
  description: string;
  quantity_on_hand: number;
  minimum_stock_level: number;
  cost_price: number;
  selling_price: number;
  category_id: string;
  vendor_id: string;
  bin_location: string;
  is_active: boolean;
  created_at: string;
  status: string;
};

export type ItemsListQuery = {
  page?: number;
  limit?: number;
  category?: string;
  vendor?: string;
  low_stock?: boolean;
  search?: string;
  sort_by?: string;
  sort_dir?: "asc" | "desc";
};

export type ItemsListData = PaginatedResult<Item> & {
  active_skus: number;
  below_threshold: number;
};

export type ItemsListResponse = ApiSuccessResponse<ItemsListData>;

export type ItemResponse = ApiSuccessResponse<Item>;
export type ItemDetailResponse = ApiSuccessResponse<ItemDetail>;

export type ItemsSearchResponse = ApiSuccessResponse<Item[]>;

export type StorageCapacity = {
  used_percent: number;
  free_percent: number;
};

export type StorageCapacityResponse = ApiSuccessResponse<StorageCapacity>;

export type CreateItemRequest = {
  sku: string;
  name: string;
  description: string;
  initial_stock: number;
  minimum_stock_level: number;
  cost_price: number;
  selling_price: number;
  category_id: string;
  vendor_id: string;
  warehouse_id: string;
  bin_location: string;
  Itemtypes: string;
};

export type CreateItemResult = {
  id: string;
  sku: string;
  name: string;
};

export type CreateItemResponse = ApiSuccessResponse<CreateItemResult>;

export type UpdateItemRequest = {
  name?: string;
  description?: string;
  minimum_stock_level?: number;
  cost_price?: number;
  selling_price?: number;
  category_id?: string;
  vendor_id?: string;
  bin_location?: string;
};

export type DeleteItemResponse = ApiSuccessResponse<null>;

export type CheckSkuResult = {
  sku: string;
  available: boolean;
  message: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function normalizeCheckSkuResult(payload: unknown): CheckSkuResult | null {
  if (!payload) return null;

  if (isRecord(payload) && isRecord(payload.data)) {
    const nested = payload.data;
    if (
      typeof nested.sku === "string" &&
      typeof nested.available === "boolean" &&
      typeof nested.message === "string"
    ) {
      return nested as CheckSkuResult;
    }
    if (isRecord(nested) && isRecord(nested.data)) {
      const twice = nested.data;
      if (
        typeof twice.sku === "string" &&
        typeof twice.available === "boolean" &&
        typeof twice.message === "string"
      ) {
        return twice as CheckSkuResult;
      }
    }
  }

  if (
    isRecord(payload) &&
    typeof payload.sku === "string" &&
    typeof payload.available === "boolean" &&
    typeof payload.message === "string"
  ) {
    return payload as CheckSkuResult;
  }

  return null;
}

function normalizeItemsListResponse(
  payload: unknown,
  fallback: { page: number; limit: number },
): ItemsListResponse | null {
  if (!payload) return null;

  const first = isRecord(payload) ? payload : null;
  const envelope =
    first && first.success === true && "data" in first
      ? first
      : first && isRecord(first.data) && first.data.success === true
        ? (first.data as Record<string, unknown>)
        : null;

  if (!envelope || envelope.success !== true) return null;

  const message =
    typeof envelope.message === "string" ? envelope.message : "Success";

  const envelopeData = envelope.data;
  const dataRoot =
    isRecord(envelopeData) &&
    isRecord(envelopeData.data) &&
    (isRecord(envelopeData.data.summary) ||
      Array.isArray(envelopeData.data.data) ||
      typeof envelopeData.data.page === "number" ||
      typeof envelopeData.data.total === "number")
      ? envelopeData.data
      : envelopeData;

  const rootRecord = isRecord(dataRoot) ? dataRoot : null;
  if (!rootRecord) return null;

  const summary = isRecord(rootRecord.summary) ? rootRecord.summary : null;
  const activeSkus =
    summary && typeof summary.active_skus === "number"
      ? summary.active_skus
      : 0;
  const belowThreshold =
    summary && typeof summary.below_threshold === "number"
      ? summary.below_threshold
      : 0;

  const items = Array.isArray(rootRecord.data)
    ? rootRecord.data
    : ([] as unknown[]);

  const page =
    typeof rootRecord.page === "number" ? rootRecord.page : fallback.page;
  const limit =
    typeof rootRecord.limit === "number" ? rootRecord.limit : fallback.limit;
  const total = typeof rootRecord.total === "number" ? rootRecord.total : 0;
  const totalPages =
    limit > 0 && total > 0 ? Math.max(1, Math.ceil(total / limit)) : 1;

  return {
    success: true,
    message,
    data: {
      data: items as Item[],
      page,
      limit,
      total,
      total_pages: totalPages,
      active_skus: activeSkus,
      below_threshold: belowThreshold,
    },
  };
}

export async function listItems(
  params: ItemsListQuery,
): Promise<ItemsListResponse> {
  const res = await apiClient.get("/items", { params });
  const fallback = {
    page: params.page ?? 1,
    limit: params.limit ?? 20,
  };
  const normalized = normalizeItemsListResponse(res.data as unknown, fallback);
  return normalized ?? (res.data as ItemsListResponse);
}

export async function getItem(id: string): Promise<ItemDetailResponse> {
  const res = await apiClient.get(`/items/${id}`);
  return res.data as ItemDetailResponse;
}

export async function searchItems(query: string): Promise<ItemsSearchResponse> {
  const res = await apiClient.get("/items/search", { params: { q: query } });
  return res.data as ItemsSearchResponse;
}

export async function getStorageCapacity(): Promise<StorageCapacityResponse> {
  const res = await apiClient.get("/items/storage/capacity");
  return res.data as StorageCapacityResponse;
}

export async function createItem(
  data: CreateItemRequest,
): Promise<CreateItemResponse> {
  const res = await apiClient.post("/items", data);
  return res.data as CreateItemResponse;
}

export async function checkSkuAvailability(
  sku: string,
): Promise<CheckSkuResult> {
  const res = await apiClient.get("/items/check-sku", {
    params: { sku },
  });
  const normalized = normalizeCheckSkuResult(res.data as unknown);
  if (!normalized) throw new Error("Invalid SKU validation response");
  return normalized;
}

export async function updateItem(
  id: string,
  data: UpdateItemRequest,
): Promise<ItemResponse> {
  const res = await apiClient.patch(`/items/${id}`, data);
  return res.data as ItemResponse;
}

export async function deleteItem(id: string): Promise<DeleteItemResponse> {
  const res = await apiClient.delete(`/items/${id}`);
  return res.data as DeleteItemResponse;
}
