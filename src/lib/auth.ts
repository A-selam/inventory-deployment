import { apiClient } from "@/lib/api-client";
import type { ApiSuccessResponse } from "@/types/api";
import type { User } from "@/types/auth";

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginData = {
  access_token: string;
  token_type: string;
  user: User;
};

export type LoginResponse = ApiSuccessResponse<LoginData>;

export type RegisterRequest = {
  token: string;
  password: string;
};

export type RegisterData = {
  id: string;
  name: string;
  email: string;
  role: User["role"];
};

export type RegisterResponse = ApiSuccessResponse<RegisterData>;

export async function login(data: LoginRequest): Promise<LoginResponse> {
  // Backend auth integration stays here for later reattachment.
  const res = await apiClient.post("/auth/login", data);
  return res.data as LoginResponse;
}

export async function registerUser(
  data: RegisterRequest,
): Promise<RegisterResponse> {
  // Backend invite integration stays here for later reattachment.
  const res = await apiClient.post("/auth/register", data);
  return res.data as RegisterResponse;
}

export async function acceptInvitation(
  data: RegisterRequest,
): Promise<RegisterResponse> {
  return registerUser(data);
}
