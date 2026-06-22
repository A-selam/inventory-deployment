import { Mail, Zap, Users } from "lucide-react";

import Card from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function UsersStatsCards({
  totalUsers,
  activeNow,
  pendingInvites,
  isLoading,
}: {
  totalUsers: number;
  activeNow: number;
  pendingInvites: number;
  isLoading: boolean;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card className="rounded-[12px] border-border p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="label-caps">Total users</div>
          <Users className="size-4 text-muted-foreground" />
        </div>
        {isLoading ? (
          <Skeleton className="mt-3 h-8 w-24" />
        ) : (
          <p className="mt-2 text-2xl font-semibold">{totalUsers}</p>
        )}
      </Card>

      <Card className="rounded-[12px] border-border p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="label-caps">Active now</div>
          <Zap className="size-4 text-muted-foreground" />
        </div>
        {isLoading ? (
          <Skeleton className="mt-3 h-8 w-20" />
        ) : (
          <p className="mt-2 text-2xl font-semibold">{activeNow}</p>
        )}
      </Card>

      <Card className="rounded-[12px] border-border border-dashed p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="label-caps">Pending invites</div>
          <Mail className="size-4 text-muted-foreground" />
        </div>
        {isLoading ? (
          <Skeleton className="mt-3 h-8 w-20" />
        ) : (
          <p className="mt-2 text-2xl font-semibold">{pendingInvites}</p>
        )}
      </Card>
    </div>
  );
}
