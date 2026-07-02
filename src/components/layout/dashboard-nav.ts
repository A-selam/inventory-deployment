import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowRightLeft,
  Building2,
  LayoutDashboard,
  Package,
  Users,
} from "lucide-react";

export type DashboardNavChild = {
  label: string;
  href: string;
};

export type DashboardNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  children?: DashboardNavChild[];
  adminOnly?: boolean;
};

export const DASHBOARD_NAV_LINKS: DashboardNavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    label: "Items",
    href: "/inventory",
    icon: Package,
    children: [
      { label: "All Inventory", href: "/inventory" },
      { label: "Categories", href: "/categories" },
      { label: "Warehouses", href: "/warehouses" },
    ],
  },
  { label: "Transactions", href: "/transactions", icon: ArrowRightLeft },
  { label: "Vendors", href: "/vendors", icon: Building2 },
  // { label: "Replenishment", href: "/replenishment", icon: RefreshCw },
  { label: "Alerts", href: "/alerts", icon: AlertTriangle },
  { label: "Users", href: "/users", icon: Users, adminOnly: true },
];

export function isPathActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
