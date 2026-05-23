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

export type AcceptInvitationRequest = {
  token: string;
  password: string;
};

export type AcceptInvitationResponse = {
  message: string;
};

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const res = await apiClient.post("/auth/login", data);
  return res.data as LoginResponse;
}

export async function acceptInvitation(
  data: AcceptInvitationRequest,
): Promise<AcceptInvitationResponse> {
  await new Promise((resolve) => {
    setTimeout(resolve, 650);
  });

  if (!data.token.trim()) {
    throw new Error("Invitation token is required");
  }

  return {
    message: "Invitation accepted",
  };
}
