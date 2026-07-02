import { useQuery } from "@tanstack/react-query";
import {
  getAlerts,
  type AlertsQueryParams,
  type AlertsResponse,
} from "@/lib/alerts";

const alertsKey = (params: Required<AlertsQueryParams>) =>
  ["alerts", params] as const;

export function useAlerts(params: AlertsQueryParams = {}) {
  const queryParams = {
    page: params.page ?? 1,
    limit: params.limit ?? 20,
  };

  return useQuery<AlertsResponse>({
    queryKey: alertsKey(queryParams),
    queryFn: () => getAlerts(queryParams),
  });
}
