"use client";

import { useEffect, useSyncExternalStore } from "react";
import { AlertCircle, ArrowRight } from "lucide-react";
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

      {/* <div className="grid gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(320px,1fr)]"> */}
      <div>
        <Card className="rounded-[12px] border-border shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="space-y-4">
            <Skeleton className="h-3 w-48" />
            <Skeleton className="h-4 w-80" />
            <Skeleton className="h-80 w-full rounded-[12px]" />
          </div>
        </Card>

        {/* <Card className="overflow-hidden rounded-[12px] border border-slate-800/30 bg-slate-950 p-6 text-white shadow-[0_16px_40px_rgba(15,23,42,0.18)]">
          <div className="space-y-4">
            <Skeleton className="h-3 w-24 bg-white/20" />
            <Skeleton className="h-10 w-full bg-white/10" />
            <Skeleton className="h-24 w-full bg-white/10" />
          </div>
        </Card> */}
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
  const accessToken = useAuthStore((state) => state.access_token);

  const isHydrated = useSyncExternalStore(
    (onStoreChange) => useAuthStore.persist.onFinishHydration(onStoreChange),
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );

  const enabled = isHydrated && Boolean(accessToken);

  useEffect(() => {
    if (isHydrated && !accessToken) {
      router.replace("/login");
    }
  }, [accessToken, isHydrated, router]);

  const query = useDashboardOverview({ enabled });
  console.log("Dashboard overview query:", query);

  if (!isHydrated || (isHydrated && !accessToken)) {
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

      <div>
        <StockChart yearlyData={query.data.stock_movement_chart} />
      </div>

      <RecentTransactionsTable transactions={query.data.recent_transactions} />
    </div>
  );
}
