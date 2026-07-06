import { apiClient } from "@/lib/api-client";
import type { ApiSuccessResponse } from "@/types/api";

export type WarehouseItemsCount = {
  warehouse: string;
  qty: number;
};

export type WarehouseItemsCountResponse = ApiSuccessResponse<
  Array<WarehouseItemsCount>
>;

// Note: backend endpoint: GET /dashboard/total-items-per-warehouse
export async function getTotalItemsPerWarehouse(): Promise<
  WarehouseItemsCountResponse
> {
  const res = await apiClient.get("/dashboard/total-items-per-warehouse");
  return res.data as WarehouseItemsCountResponse;
}

