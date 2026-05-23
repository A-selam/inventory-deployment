import { apiClient } from "@/lib/api-client";
import type { User } from "@/types/auth";

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: User;
};

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const res = await apiClient.post("/auth/login", data);
  return res.data as LoginResponse;
}
