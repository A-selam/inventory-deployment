import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowRightLeft,
  Building2,
  LayoutDashboard,
  Package,
  Users,
} from "lucide-react";
import type { UserRole } from "@/lib/rbac";

export type DashboardNavChild = {
  label: string;
  href: string;
  requiredPermission?: string;
  requiredRole?: UserRole | UserRole[];
};

export type DashboardNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  children?: DashboardNavChild[];
  requiredPermission?: string;
  requiredRole?: UserRole | UserRole[];
  /** @deprecated Use requiredPermission or requiredRole instead */
  adminOnly?: boolean;
};

export const DASHBOARD_NAV_LINKS: DashboardNavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    label: "Items",
    href: "/inventory",
    icon: Package,
    requiredPermission: "view:inventory",
    children: [
      {
        label: "All Inventory",
        href: "/inventory",
        requiredPermission: "view:inventory",
      },
      {
        label: "Categories",
        href: "/categories",
        requiredPermission: "manage:categories",
      },
      {
        label: "Warehouses",
        href: "/warehouses",
        requiredPermission: "manage:warehouses",
      },
    ],
  },
  {
    label: "Transactions",
    href: "/transactions",
    icon: ArrowRightLeft,
    requiredPermission: "view:transactions",
  },
  {
    label: "Suppliers",
    href: "/vendors",
    icon: Building2,
    requiredPermission: "manage:vendors",
  },
  {
    label: "Alerts",
    href: "/alerts",
    icon: AlertTriangle,
    requiredPermission: "view:inventory",
  },
  {
    label: "Users",
    href: "/users",
    icon: Users,
    requiredPermission: "manage:users",
  },
];

export function isPathActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
