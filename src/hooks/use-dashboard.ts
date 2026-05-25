import { useQuery } from "@tanstack/react-query";

import { getDashboardOverview } from "@/lib/api/dashboard.api";
import type { DashboardData } from "@/types/dashboard";

type UseDashboardOverviewOptions = {
  enabled?: boolean;
};

export function useDashboardOverview({
  enabled = true,
}: UseDashboardOverviewOptions = {}) {
  return useQuery<DashboardData, Error>({
    queryKey: ["dashboard"],
    queryFn: getDashboardOverview,
    enabled,
  });
}