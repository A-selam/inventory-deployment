import { useQuery } from "@tanstack/react-query";
import {
  getReplenishment,
  type ReplenishmentQuery,
  type ReplenishmentResponse,
} from "@/lib/replenishment";

const replenishmentKey = (params?: ReplenishmentQuery) =>
  ["replenishment", params ?? {}] as const;

export function useReplenishment(params: ReplenishmentQuery = {}) {
  return useQuery<ReplenishmentResponse>({
    queryKey: replenishmentKey(params),
    queryFn: () => getReplenishment(params),
  });
}
