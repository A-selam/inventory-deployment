import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createWarehouse,
  deleteWarehouse,
  getWarehouse,
  listWarehouses,
  updateWarehouse,
  type CreateWarehouseRequest,
  type UpdateWarehouseRequest,
  type Warehouse,
  type WarehousesListQuery,
  type WarehousesResponse,
} from "@/lib/warehouses";

const warehousesListKey = (params?: WarehousesListQuery) =>
  ["warehouses", "list", params ?? {}] as const;

export function useWarehousesList(params: WarehousesListQuery) {
  return useQuery<WarehousesResponse>({
    queryKey: warehousesListKey(params),
    queryFn: () => listWarehouses(params),
  });
}

export function useWarehouse(id?: string) {
  return useQuery<Warehouse>({
    queryKey: ["warehouses", "detail", id],
    queryFn: () => getWarehouse(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateWarehouse() {
  const queryClient = useQueryClient();

  return useMutation<Warehouse, unknown, CreateWarehouseRequest>({
    mutationFn: (data) => createWarehouse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
    },
  });
}

export function useUpdateWarehouse(id?: string) {
  const queryClient = useQueryClient();

  return useMutation<Warehouse, unknown, UpdateWarehouseRequest>({
    mutationFn: (data) => updateWarehouse(id as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
    },
  });
}

export function useDeleteWarehouse() {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, string>({
    mutationFn: (id) => deleteWarehouse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
    },
  });
}

