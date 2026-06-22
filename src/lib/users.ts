import { apiClient } from "@/lib/api-client";
import type { ApiSuccessResponse, PaginatedResult } from "@/types/api";
import type { User } from "@/types/auth";

export type UserRole = User["role"];

export type InviteUserRequest = {
  email: string;
  role: UserRole;
};

export type InviteUserData = {
  invite_token: string;
  expires_at: string;
};

export type UserSummary = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type InviteUserResponse =
  | ApiSuccessResponse<InviteUserData>
  | InviteUserData;

export type UsersListQuery = {
  page?: number;
  limit?: number;
  role?: UserRole;
  search?: string;
};

export type UsersListData = {
  total_users: number;
  active_now: number;
  pending_invites: number;
  data: PaginatedResult<UserSummary>;
};

export type UsersListResponse = ApiSuccessResponse<UsersListData>;

function isApiSuccessResponse(
  value: unknown,
): value is ApiSuccessResponse<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    (value as { success?: unknown }).success === true &&
    "data" in value
  );
}

function isPaginatedResult(
  value: unknown,
): value is PaginatedResult<UserSummary> {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.total === "number" &&
    typeof obj.page === "number" &&
    typeof obj.limit === "number" &&
    typeof obj.total_pages === "number" &&
    Array.isArray(obj.data)
  );
}

function normalizeUsersListResponse(
  raw: unknown,
  params: UsersListQuery,
): UsersListResponse {
  const wrapped: ApiSuccessResponse<unknown> = isApiSuccessResponse(raw)
    ? (raw as ApiSuccessResponse<unknown>)
    : { success: true, message: "OK", data: raw };

  const data = (wrapped.data ?? {}) as Partial<
    Omit<UsersListData, "data"> & { data: unknown }
  >;

  const totalUsersFromTop =
    typeof data.total_users === "number" ? data.total_users : undefined;
  const activeNow = typeof data.active_now === "number" ? data.active_now : 0;
  const pendingInvites =
    typeof data.pending_invites === "number" ? data.pending_invites : 0;

  const fallbackPage = params.page ?? 1;
  const fallbackLimit = params.limit ?? 20;

  let paginated: PaginatedResult<UserSummary>;
  if (isPaginatedResult(data.data)) {
    paginated = data.data;
  } else if (
    typeof data.data === "object" &&
    data.data !== null &&
    "data" in (data.data as Record<string, unknown>) &&
    Array.isArray((data.data as { data?: unknown }).data)
  ) {
    const nested = data.data as Partial<PaginatedResult<UserSummary>> & {
      data: UserSummary[];
    };
    const total =
      typeof nested.total === "number"
        ? nested.total
        : (totalUsersFromTop ?? nested.data.length);
    const limit =
      typeof nested.limit === "number" ? nested.limit : fallbackLimit;
    const page = typeof nested.page === "number" ? nested.page : fallbackPage;
    const totalPages =
      typeof nested.total_pages === "number"
        ? nested.total_pages
        : Math.max(1, Math.ceil(total / limit));

    paginated = {
      total,
      page,
      limit,
      total_pages: totalPages,
      data: nested.data,
    };
  } else if (Array.isArray(data.data)) {
    const users = data.data as UserSummary[];
    const total = totalUsersFromTop ?? users.length;
    const limit = fallbackLimit;
    const page = fallbackPage;
    paginated = {
      total,
      page,
      limit,
      total_pages: Math.max(1, Math.ceil(total / limit)),
      data: users,
    };
  } else {
    paginated = {
      total: totalUsersFromTop ?? 0,
      page: fallbackPage,
      limit: fallbackLimit,
      total_pages: 1,
      data: [],
    };
  }

  const normalized: UsersListResponse = {
    success: true,
    message: wrapped.message ?? "OK",
    data: {
      total_users: totalUsersFromTop ?? paginated.total,
      active_now: activeNow,
      pending_invites: pendingInvites,
      data: paginated,
    },
  };

  return normalized;
}

export async function inviteUser(
  data: InviteUserRequest,
): Promise<InviteUserData> {
  const res = await apiClient.post("/auth/invite", data);
  const payload = res.data as InviteUserResponse;

  if (isApiSuccessResponse(payload)) {
    return payload.data as InviteUserData;
  }

  return payload as InviteUserData;
}

export async function listUsers(
  params: UsersListQuery,
): Promise<UsersListResponse> {
  const res = await apiClient.get("/users", { params });
  return normalizeUsersListResponse(res.data, params);
}
