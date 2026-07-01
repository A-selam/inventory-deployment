import { AlertTriangle } from "lucide-react";

import Card from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AlertsStatsCards({
  total,
  critical,
  warning,
  isLoading,
}: {
  total: number;
  critical: number;
  warning: number;
  isLoading: boolean;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card className="rounded-[12px] border-border p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="label-caps">Total alerts</div>
          <AlertTriangle className="size-4 text-muted-foreground" />
        </div>
        {isLoading ? (
          <Skeleton className="mt-3 h-8 w-24" />
        ) : (
          <p className="mt-2 text-2xl font-semibold">{total}</p>
        )}
      </Card>

      <Card className="rounded-[12px] border-border p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="label-caps">Critical</div>
          <div className="flex size-8 items-center justify-center rounded-xl bg-rose-50 text-rose-700">
            <AlertTriangle className="size-4" />
          </div>
        </div>
        {isLoading ? (
          <Skeleton className="mt-3 h-8 w-20" />
        ) : (
          <p className="mt-2 text-2xl font-semibold">{critical}</p>
        )}
      </Card>

      <Card className="rounded-[12px] border-border border-dashed p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="label-caps">Warning</div>
          <div className="flex size-8 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
            <AlertTriangle className="size-4" />
          </div>
        </div>
        {isLoading ? (
          <Skeleton className="mt-3 h-8 w-20" />
        ) : (
          <p className="mt-2 text-2xl font-semibold">{warning}</p>
        )}
      </Card>
    </div>
  );
}

