import { useMutation } from "@tanstack/react-query";
import {
  acceptInvitation,
  login,
  type AcceptInvitationRequest,
  type AcceptInvitationResponse,
  type LoginResponse,
} from "@/lib/api/auth";
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
      setAuth(res.token, res.user, variables?.persistSession ?? false);
    },
  });

  const acceptInviteMutation = useMutation<
    AcceptInvitationResponse,
    unknown,
    InviteValues & { token: string }
  >({
    mutationFn: ({ token, password }) =>
      acceptInvitation({ token, password } satisfies AcceptInvitationRequest),
  });

  return { loginMutation, acceptInviteMutation } as const;
}

export default useAuth;
