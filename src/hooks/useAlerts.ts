import { useQuery } from "@tanstack/react-query";
import { getAlerts, type AlertsResponse } from "@/lib/alerts";

const alertsKey = ["alerts"] as const;

export function useAlerts() {
  return useQuery<AlertsResponse>({
    queryKey: alertsKey,
    queryFn: () => getAlerts(),
  });
}
