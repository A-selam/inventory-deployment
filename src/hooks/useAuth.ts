import { useMutation } from "@tanstack/react-query";
import {
  acceptInvitation,
  login,
  type RegisterRequest,
  type RegisterResponse,
  type LoginResponse,
} from "@/lib/auth";
import type { LoginValues } from "@/schemas/login";
import type { InviteValues } from "@/schemas/invite";
import { useAuthStore } from "@/stores/auth-store";

/**
 * Consolidated auth hook exposing auth-related mutations.
 * Start here to add more auth operations (refresh, register, etc.).
 */
export function useAuth() {
  const setAuth = useAuthStore((s) => s.setAuth);

  const loginMutation = useMutation<LoginResponse, unknown, LoginValues>({
    mutationFn: (data) => login({ email: data.email, password: data.password }),
    onSuccess: (res, variables) => {
      setAuth(
        res.data.access_token,
        res.data.token_type,
        res.data.user,
        variables?.persistSession ?? false,
      );
    },
  });

  const acceptInviteMutation = useMutation<
    RegisterResponse,
    unknown,
    InviteValues & { token: string }
  >({
    mutationFn: ({ token, password }) =>
      acceptInvitation({ token, password } satisfies RegisterRequest),
  });

  return { loginMutation, acceptInviteMutation } as const;
}

export default useAuth;
