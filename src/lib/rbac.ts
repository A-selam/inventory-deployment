import type { User } from "@/types/auth";

export type UserRole = "admin" | "operator" | "viewer";

/**
 * Permission definitions for each role
 * Centralized source of truth for what each role can do
 */
export const rolePermissions: Record<UserRole, Set<string>> = {
  admin: new Set([
    // User management
    "manage:users",
    "invite:users",
    "delete:users",
    "edit:users",

    // Inventory management
    "manage:inventory",
    "create:items",
    "edit:items",
    "delete:items",

    // Vendors
    "manage:vendors",
    "create:vendors",
    "edit:vendors",
    "delete:vendors",

    // Warehouses
    "manage:warehouses",
    "create:warehouses",
    "edit:warehouses",
    "delete:warehouses",

    // Categories
    "manage:categories",
    "create:categories",
    "edit:categories",
    "delete:categories",

    // Transactions
    "create:transactions",
    "edit:transactions",
    "delete:transactions",
    "view:transactions",

    // Reports
    "view:reports",

    // Import/Export
    "import:data",
    "export:data",

    // Replenishment
    "manage:replenishment",
    "create:replenishment",
    "edit:replenishment",
    "delete:replenishment",
  ]),

  operator: new Set([
    // Inventory management (limited)
    "create:items",
    "edit:items",

    // Transactions
    "create:transactions",
    "view:transactions",

    // Reports
    "view:reports",

    // Replenishment
    "create:replenishment",
    "edit:replenishment",

    // Dashboard
    "view:dashboard",

    "view:inventory",
    "view:reports",
    "view:dashboard",
    "view:transactions",
  ]),

  viewer: new Set([
    // Read-only access
    "view:inventory",
    "view:reports",
    "view:dashboard",
    "view:transactions",
  ]),
};

/**
 * Check if a user has a specific permission
 */
export function hasPermission(user: User | null, permission: string): boolean {
  if (!user) return false;
  if (user.role === "admin") {
    // Admin has all permissions
    return true;
  }
  return rolePermissions[user.role]?.has(permission) ?? false;
}

/**
 * Check if a user has any of the specified permissions
 */
export function hasAnyPermission(
  user: User | null,
  permissions: string[],
): boolean {
  if (!user) return false;
  return permissions.some((permission) =>
    rolePermissions[user.role]?.has(permission),
  );
}

/**
 * Check if a user has all of the specified permissions
 */
export function hasAllPermissions(
  user: User | null,
  permissions: string[],
): boolean {
  if (!user) return false;
  return permissions.every((permission) =>
    rolePermissions[user.role]?.has(permission),
  );
}

/**
 * Check if a user is a specific role
 */
export function isRole(user: User | null, role: UserRole): boolean {
  return user?.role === role;
}

/**
 * Check if a user is one of the specified roles
 */
export function isAnyRole(user: User | null, roles: UserRole[]): boolean {
  return roles.includes(user?.role as UserRole);
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: UserRole): string[] {
  return Array.from(rolePermissions[role] ?? new Set());
}

/**
 * Check if user is admin
 */
export function isAdmin(user: User | null): boolean {
  return user?.role === "admin";
}

/**
 * Check if user is operator
 */
export function isOperator(user: User | null): boolean {
  return user?.role === "operator";
}

/**
 * Check if user is viewer
 */
export function isViewer(user: User | null): boolean {
  return user?.role === "viewer";
}

/**
 * Get human-readable role label
 */
export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    admin: "Administrator",
    operator: "Operator",
    viewer: "Viewer",
  };
  return labels[role];
}

/**
 * Get role description
 */
export function getRoleDescription(role: UserRole): string {
  const descriptions: Record<UserRole, string> = {
    admin:
      "Full system access - Manage users, inventory, vendors, import/export",
    operator:
      "Can create/update items and transactions, view reports. Cannot manage users or delete system resources.",
    viewer:
      "Read-only access - View inventory, reports, and dashboard analytics",
  };
  return descriptions[role];
}
