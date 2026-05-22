"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Archive, ChevronRight, Package } from "lucide-react";

import StorageUsedCard from "@/components/shared/StorageCard";
import { cn } from "@/lib/utils";

import {
  DASHBOARD_NAV_LINKS,
  isPathActive,
  type DashboardNavItem,
} from "./dashboard-nav";

function DashboardNavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: DashboardNavItem["icon"];
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

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-sidebar text-sidebar-foreground">
      <div className="px-5 py-5">
        <div className="flex items-start gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center self-center rounded-sm bg-primary text-primary-foreground shadow-sm">
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
          {DASHBOARD_NAV_LINKS.slice(0, 1).map((item) => (
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
                DASHBOARD_NAV_LINKS[1].children.some((item) =>
                  isPathActive(pathname, item.href),
                )
                  ? "page"
                  : undefined
              }
              className={cn(
                "flex items-center gap-3 border-l-4 px-3 py-2 text-sm transition-colors",
                DASHBOARD_NAV_LINKS[1].children.some((item) =>
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
              {DASHBOARD_NAV_LINKS[1].children.map((item) => {
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

          {DASHBOARD_NAV_LINKS.slice(2).map((item) => (
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
  );
}
