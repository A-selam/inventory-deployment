import { apiClient } from "@/lib/api-client";
import type { ApiSuccessResponse } from "@/types/api";
import type { UserProfile } from "@/types/profile";

// ─── Response types ──────────────────────────────────────────────────────────

export type ProfileResponse = ApiSuccessResponse<UserProfile>;

export type UpdateProfileRequest = {
  name?: string;
  profile_picture?: string;
};

export type ChangePasswordRequest = {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  reset_token: string;
  new_password: string;
  confirm_new_password: string;
};

export type MessageResponse = ApiSuccessResponse<null>;

// ─── API functions ────────────────────────────────────────────────────────────

export async function getMe(): Promise<ProfileResponse> {
  const res = await apiClient.get("/auth/me");
  return res.data as ProfileResponse;
}

export async function updateMe(
  data: UpdateProfileRequest,
): Promise<ProfileResponse> {
  const res = await apiClient.patch("/auth/me", data);
  return res.data as ProfileResponse;
}

export async function changePassword(
  data: ChangePasswordRequest,
): Promise<MessageResponse> {
  const res = await apiClient.patch("/auth/change-password", data);
  return res.data as MessageResponse;
}

export async function forgotPassword(
  data: ForgotPasswordRequest,
): Promise<MessageResponse> {
  const res = await apiClient.post("/auth/forgot-password", data);
  return res.data as MessageResponse;
}

export async function resetPassword(
  data: ResetPasswordRequest,
): Promise<MessageResponse> {
  const res = await apiClient.post("/auth/reset-password", data);
  return res.data as MessageResponse;
}
