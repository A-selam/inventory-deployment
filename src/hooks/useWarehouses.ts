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
} from "@/lib/warehouses";

const warehousesListKey = ["warehouses", "list"] as const;

export function useWarehousesList() {
  return useQuery<Warehouse[]>({
    queryKey: warehousesListKey,
    queryFn: listWarehouses,
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

