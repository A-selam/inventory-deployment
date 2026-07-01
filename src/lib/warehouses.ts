import { apiClient } from "@/lib/api-client";
import type { ApiSuccessResponse } from "@/types/api";

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

export type WarehousesResponse = ApiSuccessResponse<Warehouse[]>;

export type WarehouseResponse = ApiSuccessResponse<Warehouse>;

export type CreateWarehouseRequest = {
  name: string;
  location: string | null;
  capacity: number;
  description: string | null;
};

export type UpdateWarehouseRequest = Partial<CreateWarehouseRequest>;

function isApiSuccessResponse(value: unknown): value is ApiSuccessResponse<unknown> {
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

function normalizeWarehousesList(payload: unknown): Warehouse[] {
  const wrapped: ApiSuccessResponse<unknown> = isApiSuccessResponse(payload)
    ? (payload as ApiSuccessResponse<unknown>)
    : { success: true, message: "OK", data: payload };

  const data = (wrapped.data ?? {}) as unknown;

  const list = Array.isArray(data)
    ? data
    : typeof data === "object" &&
        data !== null &&
        "data" in (data as Record<string, unknown>) &&
        Array.isArray((data as { data?: unknown }).data)
      ? ((data as { data: unknown[] }).data as unknown[])
      : [];

  return list
    .map((warehouse) => normalizeWarehouse(warehouse))
    .filter((warehouse): warehouse is Warehouse => warehouse !== null);
}

function normalizeWarehouseDetail(payload: unknown): Warehouse | null {
  const wrapped: ApiSuccessResponse<unknown> = isApiSuccessResponse(payload)
    ? (payload as ApiSuccessResponse<unknown>)
    : { success: true, message: "OK", data: payload };

  const data = (wrapped.data ?? null) as unknown;

  if (data && typeof data === "object" && "data" in (data as Record<string, unknown>)) {
    const nested = (data as { data?: unknown }).data;
    return normalizeWarehouse(nested);
  }

  return normalizeWarehouse(data);
}

export async function listWarehouses(): Promise<Warehouse[]> {
  const res = await apiClient.get("/warehouses");
  return normalizeWarehousesList(res.data as unknown);
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

