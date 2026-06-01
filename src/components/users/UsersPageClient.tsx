"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Users } from "lucide-react";

import EmptyState from "@/components/shared/EmptyState";
import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUsersList } from "@/hooks/useUsers";
import type { UserRole } from "@/lib/users";

const roles: Array<UserRole | ""> = ["", "admin", "operator", "viewer"];

export default function UsersPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") as UserRole | null) ?? undefined;

  const query = useUsersList({ role, page: 1, limit: 50 });
  const payload = query.data?.data;
  const users = payload?.data.data ?? [];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Users"
        description="Manage workspace members, roles, and pending invitations."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="rounded-[12px] border-border p-5">
          <div className="label-caps">Total users</div>
          <p className="mt-2 text-2xl font-semibold">{payload?.total_users ?? 0}</p>
        </Card>
        <Card className="rounded-[12px] border-border p-5">
          <div className="label-caps">Active now</div>
          <p className="mt-2 text-2xl font-semibold">{payload?.active_now ?? 0}</p>
        </Card>
        <Card className="rounded-[12px] border-border border-dashed p-5">
          <div className="label-caps">Pending invites</div>
          <div className="mt-2 flex items-center gap-2">
            <Mail className="size-4 text-muted-foreground" />
            <p className="text-2xl font-semibold">{payload?.pending_invites ?? 0}</p>
          </div>
        </Card>
      </div>

      <Card className="rounded-[12px] border-border p-4">
        <label className="text-sm text-muted-foreground" htmlFor="role-filter">
          Filter by role
        </label>
        <select
          id="role-filter"
          className="mt-2 h-9 w-full max-w-xs rounded-md border border-input bg-transparent px-2.5 text-sm sm:w-auto"
          value={role ?? ""}
          onChange={(event) => {
            const params = new URLSearchParams(searchParams.toString());
            if (event.target.value) params.set("role", event.target.value);
            else params.delete("role");
            router.push(`/users?${params.toString()}`);
          }}
        >
          {roles.map((entry) => (
            <option key={entry || "all"} value={entry}>
              {entry ? entry.charAt(0).toUpperCase() + entry.slice(1) : "All roles"}
            </option>
          ))}
        </select>
      </Card>

      {query.isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users match this filter"
          description="Try another role filter or invite a new team member."
        />
      ) : (
        <Card className="overflow-hidden rounded-[12px] border-border p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className="bg-muted text-foreground capitalize">
                      {user.role}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
