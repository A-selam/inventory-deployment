"use client";

import { useAuthStore } from "@/stores/auth-store";
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  isRole,
  isAnyRole,
  isAdmin,
  isOperator,
  isViewer,
  getRoleLabel,
  getRoleDescription,
  getRolePermissions,
  type UserRole,
} from "@/lib/rbac";

/**
 * Hook to access role-based permissions and utilities
 * Provides easy access to permission checking functions
 *
 * @example
 * const { can, isAdmin, user } = useRole();
 * if (can("manage:users")) {
 *   // Show manage users button
 * }
 */
export function useRole() {
  const user = useAuthStore((state) => state.user);
  const role = user?.role;

  return {
    // User info
    user,
    role,

    // Permission checks
    can: (permission: string) => hasPermission(user, permission),
    canAny: (permissions: string[]) => hasAnyPermission(user, permissions),
    canAll: (permissions: string[]) => hasAllPermissions(user, permissions),

    // Role checks
    isRole: (checkRole: UserRole) => isRole(user, checkRole),
    isAnyRole: (checkRoles: UserRole[]) => isAnyRole(user, checkRoles),
    isAdmin: () => isAdmin(user),
    isOperator: () => isOperator(user),
    isViewer: () => isViewer(user),

    // Role info
    getRoleLabel: () => getRoleLabel(role as UserRole),
    getRoleDescription: () => getRoleDescription(role as UserRole),
    getPermissions: () =>
      getRolePermissions(role as UserRole),

    // Check if user is authenticated
    isAuthenticated: !!user,
  };
}
