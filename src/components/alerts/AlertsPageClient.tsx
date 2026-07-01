"use client";

import { useMemo } from "react";
import { AlertCircle, AlertTriangle, RefreshCw } from "lucide-react";

import EmptyState from "@/components/shared/EmptyState";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";
import { useAlerts } from "@/hooks/useAlerts";
import { cn } from "@/lib/utils";
import type { Alert } from "@/lib/alerts";

import AlertsStatsCards from "./AlertsStatsCards";
// import AlertsTable from "./AlertsTable";
import AlertsTable from "@/components/alerts/AlertsTable";

function normalizeAlerts(raw: Alert[] | undefined) {
  return (raw ?? []).map((alert) => {
    const itemName =
      typeof alert.item_name === "string" && alert.item_name.trim().length > 0
        ? alert.item_name.trim()
        : "Unknown item";

    const stock =
      typeof alert.stock === "number"
        ? alert.stock
        : Number.isFinite(Number(alert.stock))
          ? Number(alert.stock)
          : 0;

    const threshold =
      typeof alert.threshold === "number"
        ? alert.threshold
        : Number.isFinite(Number(alert.threshold))
          ? Number(alert.threshold)
          : 0;

    const severity = alert.severity === "critical" ? "critical" : "warning";

    return { ...alert, item_name: itemName, stock, threshold, severity };
  });
}

function severityRank(severity: Alert["severity"]) {
  return severity === "critical" ? 0 : 1;
}

export default function AlertsPageClient() {
  const query = useAlerts();

  const rows = useMemo(() => {
    const normalized = normalizeAlerts(query.data?.data);
    return [...normalized].sort((a, b) => {
      const severityDelta =
        severityRank(a.severity as Alert["severity"]) -
        severityRank(b.severity as Alert["severity"]);
      if (severityDelta !== 0) return severityDelta;

      const deficitA = Math.max(0, a.threshold - a.stock);
      const deficitB = Math.max(0, b.threshold - b.stock);
      if (deficitA !== deficitB) return deficitB - deficitA;

      return a.item_name.localeCompare(b.item_name);
    });
  }, [query.data?.data]);

  const stats = useMemo(() => {
    let critical = 0;
    let warning = 0;

    rows.forEach((row) => {
      if (row.severity === "critical") critical += 1;
      else warning += 1;
    });

    return { total: rows.length, critical, warning };
  }, [rows]);

  const lastUpdatedLabel = useMemo(() => {
    if (!query.dataUpdatedAt) return null;
    const date = new Date(query.dataUpdatedAt);
    if (Number.isNaN(date.getTime())) return null;

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }, [query.dataUpdatedAt]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-end gap-3">
        {lastUpdatedLabel ? (
          <div className="hidden text-xs text-muted-foreground sm:block">
            Updated {lastUpdatedLabel}
          </div>
        ) : null}
        <Button
          type="button"
          variant="outline"
          className="h-11 gap-2 rounded-xl px-5"
          onClick={() => query.refetch()}
          disabled={query.isFetching}
        >
          <RefreshCw
            className={cn("size-4", query.isFetching && "animate-spin")}
          />
          Refresh
        </Button>
      </div>

      <AlertsStatsCards
        isLoading={query.isLoading}
        total={stats.total}
        critical={stats.critical}
        warning={stats.warning}
      />

      {query.isError ? (
        <EmptyState
          icon={AlertCircle}
          title="Alerts unavailable"
          description="We couldn’t load alerts from the API. Please try again."
          actionLabel="Retry"
          onAction={() => query.refetch()}
        />
      ) : query.isLoading ? (
        <Card className="rounded-[12px] border border-border p-0 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-center p-12">
            <p className="text-muted-foreground">Loading alerts...</p>
          </div>
        </Card>
      ) : rows.length === 0 ? (
        <EmptyState
          icon={AlertTriangle}
          title="No alerts right now"
          description="All items are currently above their configured thresholds."
        />
      ) : (
        <AlertsTable rows={rows as Alert[]} />
      )}
    </div>
  );
}
