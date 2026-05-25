import type { LucideIcon } from "lucide-react";
import {
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
};

export const DASHBOARD_NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    label: "Items",
    href: "/inventory",
    icon: Package,
    children: [
      { label: "All Inventory", href: "/inventory" },
      { label: "Bulk Import", href: "/imports" },
      { label: "Categories", href: "/categories" },
    ],
  },
  { label: "Transactions", href: "/transactions", icon: ArrowRightLeft },
  { label: "Vendors", href: "/vendors", icon: Building2 },
  { label: "Users", href: "/users", icon: Users },
] as const satisfies readonly DashboardNavItem[];

export function isPathActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
