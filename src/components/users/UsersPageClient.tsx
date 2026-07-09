"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RefreshCw, UserPlus } from "lucide-react";

import UsersFiltersBar from "@/components/users/UsersFiltersBar";
import UsersPagination from "@/components/users/UsersPagination";
import UsersTable from "@/components/users/UsersTable";
import InviteUserModal from "@/components/users/InviteUserModal";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import { useUsersList } from "@/hooks/useUsers";
import type { UserRole } from "@/lib/users";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

function parsePositiveInt(value: string | null, fallback: number) {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseRole(value: string | null): UserRole | undefined {
  if (value === "admin" || value === "operator" || value === "viewer")
    return value;
  return undefined;
}

function buildUsersHref(
  current: Pick<URLSearchParams, "toString">,
  updates: Record<string, string | number | undefined>,
) {
  const params = new URLSearchParams(current.toString());

  Object.entries(updates).forEach(([key, value]) => {
    if (value === undefined || value === "") params.delete(key);
    else params.set(key, String(value));
  });

  const query = params.toString();
  return query ? `/users?${query}` : "/users";
}

function UsersErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <Card className="rounded-[12px] border-border bg-card p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="label-caps">Users unavailable</div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {message}
          </p>
        </div>
        <Button type="button" className="h-11 gap-2 px-4" onClick={onRetry}>
          <RefreshCw className="size-4" />
          Retry
        </Button>
      </div>
    </Card>
  );
}

export default function UsersPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inviteOpen, setInviteOpen] = useState(false);
  const page = parsePositiveInt(searchParams.get("page"), DEFAULT_PAGE);
  const limit = parsePositiveInt(searchParams.get("limit"), DEFAULT_LIMIT);
  const role = parseRole(searchParams.get("role"));
  const search = searchParams.get("search") ?? "";

  useEffect(() => {
    const normalizedPage = searchParams.get("page");
    const normalizedLimit = searchParams.get("limit");
    const normalizedRole = searchParams.get("role");
    const normalizedSearch = searchParams.get("search") ?? "";

    if (
      normalizedPage === String(page) &&
      normalizedLimit === String(limit) &&
      normalizedRole === (role ?? null) &&
      normalizedSearch === search
    ) {
      return;
    }

    router.replace(
      buildUsersHref(searchParams, {
        page,
        limit,
        role,
        search: search || undefined,
      }),
    );
  }, [limit, page, role, router, search, searchParams]);

  const query = useUsersList({
    role,
    page,
    limit,
    search: search || undefined,
  });
  const payload = query.data?.data;
  const paginated = payload?.data;
  const users = paginated?.data ?? [];
  const totalPages = paginated?.total_pages ?? 1;
  const totalUsers = payload?.total_users ?? paginated?.total ?? 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <UsersFiltersBar
          role={role}
          onRoleChange={(nextRole) =>
            router.push(
              buildUsersHref(searchParams, {
                role: nextRole,
                search: search || undefined,
                page: DEFAULT_PAGE,
                limit,
              }),
            )
          }
        />
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Button
            type="button"
            size="sm"
            className="h-9 gap-2"
            onClick={() => setInviteOpen(true)}
          >
            <UserPlus className="size-4" />
            Invite User
          </Button>
        </div>
      </div>

      {query.isError ? (
        <UsersErrorState
          message={query.error.message || "We could not load users right now."}
          onRetry={() => query.refetch()}
        />
      ) : (
        <section className="space-y-0">
          <UsersTable users={users} isLoading={query.isLoading} />
          {!query.isLoading ? (
            <UsersPagination
              page={paginated?.page ?? page}
              totalPages={totalPages}
              limit={paginated?.limit ?? limit}
              totalItems={totalUsers}
              shownItems={users.length}
              onPageChange={(nextPage) =>
                router.push(
                  buildUsersHref(searchParams, {
                    role,
                    search: search || undefined,
                    page: nextPage,
                    limit,
                  }),
                )
              }
            />
          ) : null}
        </section>
      )}

      <InviteUserModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </div>
  );
}
