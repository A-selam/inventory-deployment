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
  bin_location: string;
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

export async function listItems(
  params: ItemsListQuery,
): Promise<ItemsListResponse> {
  const res = await apiClient.get("/items", { params });
  return res.data as ItemsListResponse;
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
