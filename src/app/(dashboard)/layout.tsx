"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  ArrowRightLeft,
  Bell,
  Building2,
  ChevronRight,
  LayoutDashboard,
  Package,
  Search,
  Settings,
  Users,
  Archive,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import StorageUsedCard from "@/components/shared/StorageCard";
import ProfileCard from "@/components/shared/ProfileCard";

const NAV_LINKS = [
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
] as const;

function isPathActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function DashboardNavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 border-l-4 px-3 py-2 text-sm transition-colors",
        active
          ? "border-primary bg-sidebar-accent text-primary"
          : "border-transparent text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
      )}
    >
      <Icon className="size-4 shrink-0" />
      <span>{label}</span>
    </Link>
  );
}

export default function DashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-sidebar text-sidebar-foreground">
        <div className="px-5 py-5">
          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-primary text-primary-foreground shadow-sm self-center">
              <Archive className="size-4" />
            </div>
            <div className="leading-none">
              <div className="text-lg font-semibold tracking-tight text-sidebar-foreground">
                StockLogic
              </div>
              <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.28em] text-sidebar-accent-foreground">
                GLOBAL WAREHOUSE
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4">
          <div className="space-y-1">
            {NAV_LINKS.slice(0, 1).map((item) => (
              <DashboardNavLink
                key={item.label}
                href={item.href}
                label={item.label}
                active={isPathActive(pathname, item.href)}
                icon={item.icon}
              />
            ))}

            <div>
              <Link
                href="/inventory"
                aria-current={
                  NAV_LINKS[1].children.some((item) =>
                    isPathActive(pathname, item.href),
                  )
                    ? "page"
                    : undefined
                }
                className={cn(
                  "flex items-center gap-3 border-l-4 px-3 py-2 text-sm transition-colors",
                  NAV_LINKS[1].children.some((item) =>
                    isPathActive(pathname, item.href),
                  )
                    ? "border-primary bg-sidebar-accent text-primary"
                    : "border-transparent text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
                )}
              >
                <Package className="size-4 shrink-0" />
                <span>Items</span>
                <ChevronRight className="ml-auto size-4 opacity-40" />
              </Link>

              <div className="mt-1 space-y-1 pl-6">
                {NAV_LINKS[1].children.map((item) => {
                  const active = isPathActive(pathname, item.href);

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "block rounded-md border-l-4 py-1.5 pl-4 text-sm transition-colors",
                        active
                          ? "border-primary bg-sidebar-accent text-primary"
                          : "border-transparent text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {NAV_LINKS.slice(2).map((item) => (
              <DashboardNavLink
                key={item.label}
                href={item.href}
                label={item.label}
                active={isPathActive(pathname, item.href)}
                icon={item.icon}
              />
            ))}
          </div>
        </nav>

        <StorageUsedCard />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <div className="relative w-100 max-w-full">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label="Search inventory, orders, or imports"
              placeholder="Search inventory, orders, or imports..."
              className="h-10 bg-muted pl-10 text-foreground"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
              aria-label="Notifications"
            >
              <Bell className="size-4" />
            </button>
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
              aria-label="Settings"
            >
              <Settings className="size-4" />
            </button>

            <ProfileCard />
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8 max-w-container-max">
          {children}
        </main>
      </div>
    </div>
  );
}
