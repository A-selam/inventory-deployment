"use client";

import { ReactNode } from "react";
import { useRole } from "@/hooks/useRole";

interface CanAccessProps {
  /**
   * Required permission(s)
   * If string: requires that single permission
   * If array: requires all permissions (AND logic)
   */
  permission?: string | string[];

  /**
   * Required role(s)
   * If string: requires that single role
   * If array: requires one of the roles (OR logic)
   */
  role?: "admin" | "operator" | "viewer" | ("admin" | "operator" | "viewer")[];

  /**
   * Require all of these permissions (AND logic)
   * Use when permission needs to be an array with AND logic
   */
  permissions?: string[];

  /**
   * Content to render if user has access
   */
  children: ReactNode;

  /**
   * Content to render if user doesn't have access
   * If not provided, nothing is rendered
   */
  fallback?: ReactNode;

  /**
   * Use 'any' for OR logic with permissions array
   * Use 'all' for AND logic with permissions array (default)
   */
  mode?: "any" | "all";
}

/**
 * Conditionally render content based on user role and permissions
 *
 * @example
 * // Basic permission check
 * <CanAccess permission="manage:users">
 *   <UserManagementButton />
 * </CanAccess>
 *
 * @example
 * // Role-based check
 * <CanAccess role="admin">
 *   <AdminPanel />
 * </CanAccess>
 *
 * @example
 * // Multiple roles (OR logic)
 * <CanAccess role={["admin", "operator"]}>
 *   <CreateItemButton />
 * </CanAccess>
 *
 * @example
 * // With fallback
 * <CanAccess permission="manage:users" fallback={<p>No access</p>}>
 *   <UserManagementButton />
 * </CanAccess>
 */
export function CanAccess({
  permission,
  permissions,
  role,
  children,
  fallback,
  mode = "all",
}: CanAccessProps) {
  const { can, canAny, canAll, isRole, isAnyRole } = useRole();

  let hasAccess = false;

  // Check permissions
  if (permission) {
    if (Array.isArray(permission)) {
      hasAccess = mode === "any" ? canAny(permission) : canAll(permission);
    } else {
      hasAccess = can(permission);
    }
  } else if (permissions) {
    hasAccess = mode === "any" ? canAny(permissions) : canAll(permissions);
  }

  // Check role (only if no permission checks or permission check passed)
  if (role) {
    if (Array.isArray(role)) {
      hasAccess = hasAccess && isAnyRole(role);
    } else {
      hasAccess = hasAccess && isRole(role);
    }
  } else if (!permission && !permissions) {
    // If no permission or role specified, check if role check passes
    if (!role) {
      hasAccess = true; // Default to true if no constraints
    }
  }

  return hasAccess ? children : fallback;
}
