import { apiClient } from "@/lib/api-client";
import type { ApiSuccessResponse, PaginatedResult } from "@/types/api";
import type { User } from "@/types/auth";

export type UserRole = User["role"];

export type InviteUserRequest = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export type UserSummary = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type InviteUserResponse = ApiSuccessResponse<UserSummary>;

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

export async function inviteUser(
  data: InviteUserRequest,
): Promise<InviteUserResponse> {
  const res = await apiClient.post("/users/invite", data);
  return res.data as InviteUserResponse;
}

export async function listUsers(
  params: UsersListQuery,
): Promise<UsersListResponse> {
  const res = await apiClient.get("/users", { params });
  return res.data as UsersListResponse;
}
