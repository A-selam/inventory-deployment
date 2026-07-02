import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changePassword,
  forgotPassword,
  getMe,
  resetPassword,
  updateMe,
  type ChangePasswordRequest,
  type ForgotPasswordRequest,
  type ProfileResponse,
  type ResetPasswordRequest,
  type UpdateProfileRequest,
} from "@/lib/profile";
import { useAuthStore } from "@/stores/auth-store";

// ─── Query key ────────────────────────────────────────────────────────────────

export const profileKey = ["profile", "me"] as const;

// ─── Hooks ────────────────────────────────────────────────────────────────────

/** Fetch current user's full profile from GET /auth/me */
export function useProfile() {
  return useQuery<ProfileResponse>({
    queryKey: profileKey,
    queryFn: getMe,
  });
}

/** PATCH /auth/me — updates name / profile_picture */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((s) => s.setAuth);
  const store = useAuthStore.getState();

  return useMutation<ProfileResponse, unknown, UpdateProfileRequest>({
    mutationFn: (data) => updateMe(data),
    onSuccess: (res) => {
      // Refresh cached profile
      queryClient.setQueryData(profileKey, res);
      // Also sync the lightweight user object in the auth store
      // so the sidebar / header reflect the new name immediately
      const updated = res.data;
      setAuth(
        store.access_token!,
        store.token_type!,
        store.refresh_token!,
        {
          id: updated.id,
          name: updated.name,
          email: updated.email,
          role: updated.role,
        },
        store.persistSession,
      );
    },
  });
}

/** PATCH /auth/change-password */
export function useChangePassword() {
  return useMutation<unknown, unknown, ChangePasswordRequest>({
    mutationFn: (data) => changePassword(data),
  });
}

/** POST /auth/forgot-password — public */
export function useForgotPassword() {
  return useMutation<unknown, unknown, ForgotPasswordRequest>({
    mutationFn: (data) => forgotPassword(data),
  });
}

/** POST /auth/reset-password — public */
export function useResetPassword() {
  return useMutation<unknown, unknown, ResetPasswordRequest>({
    mutationFn: (data) => resetPassword(data),
  });
}
