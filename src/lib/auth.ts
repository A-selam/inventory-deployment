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
  // user: User;
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

function normalizeLoginResponse(payload: unknown): LoginResponse {
  if (isApiSuccessResponse(payload)) {
    return payload as LoginResponse;
  }

  if (typeof payload === "object" && payload !== null) {
    const raw = payload as Partial<LoginData> & { data?: unknown };
    const rawData = raw.data as Partial<LoginData> | undefined;

    const access_token =
      typeof rawData?.access_token === "string"
        ? rawData.access_token
        : typeof raw.access_token === "string"
          ? raw.access_token
          : undefined;
    const token_type =
      typeof rawData?.token_type === "string"
        ? rawData.token_type
        : typeof raw.token_type === "string"
          ? raw.token_type
          : "bearer";

    if (access_token) {
      return {
        success: true,
        message: "OK",
        data: {
          access_token,
          token_type,
        },
      };
    }
  }

  throw new Error("Invalid login response");
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  // Backend auth integration stays here for later reattachment.
  const res = await apiClient.post("/auth/login", data);
  return normalizeLoginResponse(res.data as unknown);
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
