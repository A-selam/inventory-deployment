import type { Warehouse } from "@/lib/warehouses";

export type WarehouseSortBy = "name" | "capacity" | "used_capacity" | "created_at";

export type WarehouseSortDir = "asc" | "desc";

export const DEFAULT_WAREHOUSE_SORT_BY: WarehouseSortBy = "name";
export const DEFAULT_WAREHOUSE_SORT_DIR: WarehouseSortDir = "asc";

export function parseWarehouseSortBy(value: string | null): WarehouseSortBy {
  if (value === "capacity" || value === "used_capacity" || value === "created_at") {
    return value;
  }
  return DEFAULT_WAREHOUSE_SORT_BY;
}

export function parseWarehouseSortDir(value: string | null): WarehouseSortDir {
  return value === "desc" ? "desc" : DEFAULT_WAREHOUSE_SORT_DIR;
}

export function buildWarehousesHref(
  current: Pick<URLSearchParams, "toString">,
  updates: Record<string, string | undefined>,
) {
  const params = new URLSearchParams(current.toString());

  Object.entries(updates).forEach(([key, value]) => {
    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  });

  const query = params.toString();
  return query ? `/warehouses?${query}` : "/warehouses";
}

export function sortWarehouses(
  warehouses: Warehouse[],
  sortBy: WarehouseSortBy,
  sortDir: WarehouseSortDir,
) {
  const direction = sortDir === "asc" ? 1 : -1;
  const items = [...warehouses];

  items.sort((first, second) => {
    if (sortBy === "capacity") {
      return (first.capacity - second.capacity) * direction;
    }
    if (sortBy === "used_capacity") {
      return (first.used_capacity - second.used_capacity) * direction;
    }
    if (sortBy === "created_at") {
      const firstTs = Date.parse(first.created_at || "");
      const secondTs = Date.parse(second.created_at || "");
      const safeFirst = Number.isFinite(firstTs) ? firstTs : 0;
      const safeSecond = Number.isFinite(secondTs) ? secondTs : 0;
      return (safeFirst - safeSecond) * direction;
    }
    return first.name.localeCompare(second.name) * direction;
  });

  return items;
}

export function formatWarehouseDate(value: string) {
  const ts = Date.parse(value);
  if (!Number.isFinite(ts)) return "—";
  return new Date(ts).toLocaleString();
}

export function getWarehouseUtilizationPercent(warehouse: Warehouse) {
  if (!warehouse.capacity || warehouse.capacity <= 0) return null;
  const percent = (warehouse.used_capacity / warehouse.capacity) * 100;
  if (!Number.isFinite(percent)) return null;
  return Math.max(0, Math.min(100, percent));
}

