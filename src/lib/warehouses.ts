import { apiClient } from "@/lib/api-client";
import type { ApiSuccessResponse, PaginatedResult } from "@/types/api";

export type Warehouse = {
  id: string;
  name: string;
  location: string | null;
  capacity: number;
  description: string | null;
  created_at: string;
  used_capacity: number;
  available_capacity: number;
};

export type WarehousesListQuery = {
  page?: number;
  limit?: number;
};

export type WarehousesListData = PaginatedResult<Warehouse>;

export type WarehousesResponse = ApiSuccessResponse<WarehousesListData>;

export type WarehouseResponse = ApiSuccessResponse<Warehouse>;

export type CreateWarehouseRequest = {
  name: string;
  location: string | null;
  capacity: number;
  description: string | null;
};

export type UpdateWarehouseRequest = Partial<CreateWarehouseRequest>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isApiSuccessResponse(
  value: unknown,
): value is ApiSuccessResponse<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    (value as { success?: unknown }).success === true &&
    "data" in value
  );
}

function coerceNumber(value: unknown, fallback = 0) {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function normalizeWarehouse(value: unknown): Warehouse | null {
  if (typeof value !== "object" || value === null) return null;
  const raw = value as Partial<Warehouse>;

  if (typeof raw.id !== "string" || typeof raw.name !== "string") return null;

  const location =
    typeof raw.location === "string"
      ? raw.location
      : raw.location === null
        ? null
        : null;

  const description =
    typeof raw.description === "string"
      ? raw.description
      : raw.description === null
        ? null
        : null;

  const created_at = typeof raw.created_at === "string" ? raw.created_at : "";

  return {
    id: raw.id,
    name: raw.name,
    location,
    capacity: Math.max(0, coerceNumber(raw.capacity, 0)),
    description,
    created_at,
    used_capacity: Math.max(0, coerceNumber(raw.used_capacity, 0)),
    available_capacity: Math.max(0, coerceNumber(raw.available_capacity, 0)),
  };
}

function normalizeWarehousesListResponse(
  payload: unknown,
  fallback: { page: number; limit: number },
): WarehousesResponse | null {
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
    typeof envelope.message === "string" ? envelope.message : "OK";

  const envelopeData = envelope.data;
  const dataRoot =
    isRecord(envelopeData) &&
    isRecord(envelopeData.data) &&
    (Array.isArray(envelopeData.data.data) ||
      typeof envelopeData.data.page === "number" ||
      typeof envelopeData.data.total === "number")
      ? envelopeData.data
      : envelopeData;

  const rootRecord = isRecord(dataRoot) ? dataRoot : null;
  if (!rootRecord) return null;

  const rawList = Array.isArray(rootRecord.data)
    ? rootRecord.data
    : ([] as unknown[]);

  const warehouses = rawList
    .map((warehouse) => normalizeWarehouse(warehouse))
    .filter((warehouse): warehouse is Warehouse => warehouse !== null);

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
      data: warehouses,
      page,
      limit,
      total,
      total_pages: totalPages,
    },
  };
}

function normalizeWarehouseDetail(payload: unknown): Warehouse | null {
  const wrapped: ApiSuccessResponse<unknown> = isApiSuccessResponse(payload)
    ? (payload as ApiSuccessResponse<unknown>)
    : { success: true, message: "OK", data: payload };

  const data = (wrapped.data ?? null) as unknown;

  if (
    data &&
    typeof data === "object" &&
    "data" in (data as Record<string, unknown>)
  ) {
    const nested = (data as { data?: unknown }).data;
    return normalizeWarehouse(nested);
  }

  return normalizeWarehouse(data);
}

export async function listWarehouses(
  params: WarehousesListQuery,
): Promise<WarehousesResponse> {
  const res = await apiClient.get("/warehouses", { params });
  const fallback = {
    page: params.page ?? 1,
    limit: params.limit ?? 20,
  };
  const normalized = normalizeWarehousesListResponse(
    res.data as unknown,
    fallback,
  );
  return normalized ?? (res.data as WarehousesResponse);
}

export async function getWarehouse(id: string): Promise<Warehouse> {
  const res = await apiClient.get(`/warehouses/${id}`);
  const normalized = normalizeWarehouseDetail(res.data as unknown);
  if (!normalized) throw new Error("Invalid warehouse response");
  return normalized;
}

export async function createWarehouse(
  data: CreateWarehouseRequest,
): Promise<Warehouse> {
  const res = await apiClient.post("/warehouses", data);
  const normalized = normalizeWarehouseDetail(res.data as unknown);
  if (!normalized) throw new Error("Invalid warehouse response");
  return normalized;
}

export async function updateWarehouse(
  id: string,
  data: UpdateWarehouseRequest,
): Promise<Warehouse> {
  const res = await apiClient.patch(`/warehouses/${id}`, data);
  const normalized = normalizeWarehouseDetail(res.data as unknown);
  if (!normalized) throw new Error("Invalid warehouse response");
  return normalized;
}

export async function deleteWarehouse(id: string): Promise<void> {
  await apiClient.delete(`/warehouses/${id}`);
}
