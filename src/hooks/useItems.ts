import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createItem,
  deleteItem,
  getItem,
  getStorageCapacity,
  listItems,
  searchItems,
  updateItem,
  type CreateItemRequest,
  type ItemResponse,
  type ItemsListQuery,
  type ItemsListResponse,
  type ItemsSearchResponse,
  type StorageCapacityResponse,
  type UpdateItemRequest,
} from "@/lib/items";

const itemsListKey = (params?: ItemsListQuery) =>
  ["items", "list", params ?? {}] as const;
const itemDetailKey = (id: string) => ["items", "detail", id] as const;
const itemSearchKey = (query: string) => ["items", "search", query] as const;
const storageCapacityKey = ["items", "storage", "capacity"] as const;

export function useItemsList(params: ItemsListQuery) {
  return useQuery<ItemsListResponse>({
    queryKey: itemsListKey(params),
    queryFn: () => listItems(params),
  });
}

export function useItem(id?: string) {
  return useQuery<ItemResponse>({
    queryKey: itemDetailKey(id ?? ""),
    queryFn: () => getItem(id as string),
    enabled: Boolean(id),
  });
}

export function useItemsSearch(query?: string) {
  return useQuery<ItemsSearchResponse>({
    queryKey: itemSearchKey(query ?? ""),
    queryFn: () => searchItems(query as string),
    enabled: Boolean(query),
  });
}

export function useStorageCapacity() {
  return useQuery<StorageCapacityResponse>({
    queryKey: storageCapacityKey,
    queryFn: () => getStorageCapacity(),
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateItemRequest) => createItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}

export function useUpdateItem(id?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateItemRequest) => updateItem(id as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}
