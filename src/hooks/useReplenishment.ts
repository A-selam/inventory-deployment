import { useQuery } from "@tanstack/react-query";
import {
  getReplenishment,
  getReplenishmentReport,
  type ReplenishmentQuery,
  type ReplenishmentReportResponse,
  type ReplenishmentResponse,
} from "@/lib/replenishment";

const replenishmentKey = (params?: ReplenishmentQuery) =>
  ["replenishment", params ?? {}] as const;
const replenishmentReportKey = ["replenishment", "report"] as const;

export function useReplenishment(params: ReplenishmentQuery) {
  return useQuery<ReplenishmentResponse>({
    queryKey: replenishmentKey(params),
    queryFn: () => getReplenishment(params),
  });
}

export function useReplenishmentReport() {
  return useQuery<ReplenishmentReportResponse>({
    queryKey: replenishmentReportKey,
    queryFn: () => getReplenishmentReport(),
  });
}
