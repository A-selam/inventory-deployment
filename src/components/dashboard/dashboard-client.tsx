"use client";

import { useEffect, useSyncExternalStore } from "react";
import { AlertCircle, ArrowRight, LayoutGrid, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardOverview } from "@/hooks/use-dashboard";
import { useAuthStore } from "@/stores/auth-store";

import OverviewCards from "./overview-cards";
import RecentTransactionsTable from "./recent-transactions-table";
import StockChart from "./stock-chart";

function DashboardLoadingState() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card
            key={index}
            className="rounded-[12px] border-border shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
          >
            <div className="space-y-4">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-10 w-28" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="size-11 rounded-xl" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(320px,1fr)]">
        <Card className="rounded-[12px] border-border shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="space-y-4">
            <Skeleton className="h-3 w-48" />
            <Skeleton className="h-4 w-80" />
            <Skeleton className="h-80 w-full rounded-[12px]" />
          </div>
        </Card>

        <Card className="overflow-hidden rounded-[12px] border border-slate-800/30 bg-slate-950 p-6 text-white shadow-[0_16px_40px_rgba(15,23,42,0.18)]">
          <div className="space-y-4">
            <Skeleton className="h-3 w-24 bg-white/20" />
            <Skeleton className="h-10 w-full bg-white/10" />
            <Skeleton className="h-24 w-full bg-white/10" />
          </div>
        </Card>
      </div>

      <Card className="rounded-[12px] border-border shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="space-y-4">
          <Skeleton className="h-3 w-44" />
          <Skeleton className="h-4 w-72" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-14 w-full" />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

function DashboardErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <Card className="rounded-[12px] border-border shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex size-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
            <AlertCircle className="size-5" />
          </div>
          <div className="space-y-2">
            <div className="label-caps">Dashboard Unavailable</div>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              {message}
            </p>
          </div>
        </div>

        <Button
          type="button"
          className="inline-flex h-11 items-center gap-2 self-start bg-[#0B0F14] px-4 text-sm font-semibold text-white hover:bg-[#111827]"
          onClick={onRetry}
        >
          Retry
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </Card>
  );
}

export default function DashboardClient() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  const isHydrated = useSyncExternalStore(
    (onStoreChange) => useAuthStore.persist.onFinishHydration(onStoreChange),
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );

  const enabled = isHydrated && Boolean(token);

  useEffect(() => {
    if (isHydrated && !token) {
      router.replace("/login");
    }
  }, [isHydrated, router, token]);

  const query = useDashboardOverview({ enabled });
  const promoStats = [
    { label: "Live Zones", value: "12" },
    { label: "Automated Pick Paths", value: "98%" },
    { label: "Cycle Count Accuracy", value: "99.4%" },
  ];

  if (!isHydrated || (isHydrated && !token)) {
    return <DashboardLoadingState />;
  }

  if (query.isLoading) {
    return <DashboardLoadingState />;
  }

  if (query.isError) {
    return (
      <DashboardErrorState
        message={
          query.error.message || "We could not load the dashboard overview."
        }
        onRetry={() => query.refetch()}
      />
    );
  }

  if (!query.data) {
    return <DashboardLoadingState />;
  }

  return (
    <div className="space-y-8">
      <OverviewCards data={query.data} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(320px,1fr)]">
        <StockChart data={query.data.stock_movement_chart} />

        <Card className="relative overflow-hidden rounded-[12px] border border-slate-800/30 bg-slate-950 p-6 text-white shadow-[0_16px_40px_rgba(15,23,42,0.18)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0.2),rgba(15,23,42,0.9))]" />
          <div className="absolute inset-x-6 top-6 h-24 rounded-3xl border border-white/10 bg-white/5" />
          <div className="absolute -right-16 top-10 size-40 rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="absolute -left-8 bottom-4 size-28 rounded-full bg-slate-500/20 blur-2xl" />

          <div className="relative z-10 flex h-full flex-col justify-between gap-8">
            <div className="space-y-4">
              <div className="label-caps text-slate-300!">
                Warehouse Automation
              </div>
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-white/70">
                  <LayoutGrid className="size-3.5" />
                  Zone A-1 Optimized
                </div>
                <h2 className="max-w-xs text-2xl font-semibold tracking-tight text-white">
                  Warehouse Automation - ZONE A-1 OPTIMIZED
                </h2>
                <p className="max-w-xs text-sm leading-6 text-white/70">
                  Rebalanced picking lanes, improved replenishment timing, and
                  automated stock verification.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {promoStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                >
                  <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/55">
                    {stat.label}
                  </div>
                  <div className="mt-2 text-xl font-semibold text-white">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 backdrop-blur-sm">
              <span>Optimize throughput with predictive replenishment</span>
              <ShieldAlert className="size-4 text-cyan-300" />
            </div>
          </div>
        </Card>
      </div>

      <RecentTransactionsTable transactions={query.data.recent_transactions} />
    </div>
  );
}
