import { Users } from "lucide-react";

import EmptyState from "@/components/shared/EmptyState";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Card from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { UserSummary } from "@/lib/users";
// import UserRowActions from "@/components/users/UserRowActions";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function roleBadgeClass(role: UserSummary["role"]) {
  if (role === "admin") {
    return "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-500/15 dark:text-purple-200 dark:border-purple-500/30";
  }
  if (role === "operator") {
    return "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/15 dark:text-blue-200 dark:border-blue-500/30";
  }
  if (role === "viewer") {
    return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-500/15 dark:text-slate-200 dark:border-slate-500/30";
  }
  return "bg-muted text-foreground border-border";
}

export default function UsersTable({
  users,
  isLoading,
}: {
  users: UserSummary[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <Card className="overflow-hidden rounded-[12px] border-border p-0">
        <div className="border-b border-border bg-muted/30 px-4 py-3">
          <Skeleton className="h-5 w-56" />
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {Array.from({ length: 7 }).map((_, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <Skeleton className="size-9 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-7 w-24 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (users.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No users match this filter"
        description="Try another role filter or adjust your search."
      />
    );
  }

  return (
    <Card className="overflow-hidden rounded-[12px] border-border p-0">
      <div className="border-b border-border bg-muted/25 px-4 py-3">
        <div className="label-caps">Workspace members</div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            {/* <TableHead className="text-right">Actions</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="group">
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{initials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="truncate font-medium text-foreground">
                      {user.name}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-mono text-sm text-muted-foreground">
                {user.email}
              </TableCell>
              <TableCell>
                <Badge
                  className={cn(
                    "rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider",
                    roleBadgeClass(user.role),
                  )}
                >
                  {user.role}
                </Badge>
              </TableCell>
              {/* <TableCell className="text-right">
                <UserRowActions user={user} />
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
