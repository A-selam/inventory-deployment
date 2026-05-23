import { useMutation } from "@tanstack/react-query";
import { login, type LoginResponse } from "@/lib/auth";
import type { LoginValues } from "@/schemas/login";
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

  return { loginMutation } as const;
}

export default useAuth;
