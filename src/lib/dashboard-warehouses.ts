import { apiClient } from "@/lib/api-client";
import type { ApiSuccessResponse } from "@/types/api";

export type WarehouseItemsCount = {
  warehouse: string;
  qty: number;
};

export type WarehouseItemsCountResponse = ApiSuccessResponse<
  Array<WarehouseItemsCount>
>;

// Backend does not expose GET /dashboard/total-items-per-warehouse.
// Compute "items by warehouse" by fetching each warehouse's summary.
// Using summary.total_items to represent COUNT of items/SKUs per warehouse.
export async function getTotalItemsPerWarehouse(): Promise<
  WarehouseItemsCountResponse
> {
  // Fetch all warehouses first (we only need their ids).
  // If your dataset can be large, we can later optimize by using a dedicated backend endpoint.
  const warehousesRes = await apiClient.get("/warehouses", {
    params: { page: 1, limit: 1000 },
  });

  const warehousesPayload = warehousesRes.data as unknown;
  const warehousesData = (warehousesPayload as { data?: { data?: unknown } }).data;


  // Expect shape similar to other list endpoints: data: { data: Warehouse[] }
  const list =
    Array.isArray(warehousesData?.data)
      ? warehousesData.data
      : Array.isArray((warehousesPayload as any)?.data?.data)
        ? (warehousesPayload as any).data.data
        : [];

  const warehouseIds = list
    .map((w: any) => (typeof w?.id === "string" ? w.id : null))
    .filter((id: string | null): id is string => Boolean(id));

  const summaries = await Promise.all(
    warehouseIds.map(async (warehouse_id: string) => {
      try {
        const summaryRes = await apiClient.get(
          `/warehouses/${warehouse_id}/summary`,
        );

        const summary = summaryRes.data?.data ?? summaryRes.data;
        const totalItems = summary?.total_items;
        const qty =
          typeof totalItems === "number"
            ? totalItems
            : typeof totalItems === "string"
              ? Number(totalItems)
              : 0;

        const warehouseName = (summary as any)?.warehouse_name ?? (summary as any)?.name;
        return {
          warehouse: typeof warehouseName === "string" && warehouseName.trim() !== ""
            ? warehouseName
            : warehouse_id,
          qty: Number.isFinite(qty) ? Math.max(0, qty) : 0,
        };

      } catch {
        // Keep dashboard functional if a single warehouse summary fails.
        return { warehouse: warehouse_id, qty: 0 };
      }
    }),
  );

  return {
    success: true,
    message: "Warehouse items retrieved successfully",
    data: summaries,
    total: null,
  } as WarehouseItemsCountResponse;
}


