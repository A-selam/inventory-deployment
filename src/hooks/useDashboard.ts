import { useQuery } from "@tanstack/react-query";
import {
  getDashboard,
  searchDashboard,
  type DashboardResponse,
  type DashboardSearchResponse,
} from "@/lib/dashboard";

const dashboardKey = ["dashboard"] as const;
const dashboardSearchKey = (query: string) =>
  ["dashboard", "search", query] as const;

export function useDashboard() {
  return useQuery<DashboardResponse>({
    queryKey: dashboardKey,
    queryFn: () => getDashboard(),
  });
}

export function useDashboardSearch(query?: string) {
  return useQuery<DashboardSearchResponse>({
    queryKey: dashboardSearchKey(query ?? ""),
    queryFn: () => searchDashboard(query as string),
    enabled: Boolean(query),
  });
}
