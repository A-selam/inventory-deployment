"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Archive,
  ChevronRight,
  Package,
  X,
  PanelLeftOpen,
  PanelLeftClose,
} from "lucide-react";

import ProfileCard from "@/components/shared/ProfileCard";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";

import { useUiStore } from "@/stores/ui-store";

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
  collapsed,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: DashboardNavItem["icon"];
  active: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={(e) => {
        e.stopPropagation();
        onNavigate?.();
      }}
      aria-current={active ? "page" : undefined}
      title={collapsed ? label : undefined}
      className={cn(
        "flex items-center gap-3 border-l-4 px-3 py-2 text-sm transition-colors",
        active
          ? "border-primary bg-sidebar-accent text-primary"
          : "border-transparent text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
        collapsed && "justify-center px-2",
      )}
    >
      <Icon className="size-4 shrink-0" />
      {!collapsed ? <span>{label}</span> : null}
    </Link>
  );
}

export default function DashboardSidebar() {
  const pathname = usePathname();
  const userRole = useAuthStore((state) => state.user?.role);
  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileSidebarOpen,
    setMobileSidebarOpen,
  } = useUiStore();

  const navItems = DASHBOARD_NAV_LINKS.filter(
    (item) => !item.adminOnly || userRole === "admin",
  );

  const itemsNav = navItems.find((item) => item.label === "Items");
  const topLevelItems = navItems.filter(
    (item) => item.label !== "Dashboard" && !item.children,
  );

  const closeMobile = () => setMobileSidebarOpen(false);

  return (
    <>
      {mobileSidebarOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={closeMobile}
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-dvh shrink-0 flex-col border-r border-border bg-sidebar text-sidebar-foreground transition-all duration-200 lg:static lg:z-auto",
          sidebarCollapsed ? "w-18" : "w-64",
          mobileSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
        )}
        onClick={(e) => {
          e.preventDefault();
          setSidebarCollapsed(false);
        }}
      >
        <div
          className={cn(
            "flex justify-between items-center px-5 py-5",
            sidebarCollapsed && "px-3 justify-center",
          )}
        >
          <div
            className={cn(
              "flex items-center gap-3",
              sidebarCollapsed && "justify-center",
            )}
          >
            <div className="flex size-8 shrink-0 items-center justify-center self-center rounded-sm bg-primary text-primary-foreground shadow-sm">
              <Archive className="size-4" />
            </div>
            {!sidebarCollapsed ? (
              <div className="leading-none">
                <div className="text-lg font-semibold tracking-tight text-sidebar-foreground">
                  StockLogic
                </div>
                {/* <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.28em] text-sidebar-accent-foreground">
                  GLOBAL WAREHOUSE
                </div> */}
              </div>
            ) : null}
            <button
              type="button"
              className="ml-auto inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-accent lg:hidden"
              onClick={closeMobile}
              aria-label="Close sidebar"
            >
              <X className="size-4" />
            </button>
          </div>
          <button
            type="button"
            className={cn(
              "ml-4 items-center justify-center rounded-md text-muted-foreground hover:bg-muted ",
              sidebarCollapsed && "hidden",
            )}
            onClick={(e) => {
              e.stopPropagation();
              setSidebarCollapsed(!sidebarCollapsed);
            }}
            aria-label={
              sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="hidden size-5" />
            ) : (
              <PanelLeftClose className="size-5" />
            )}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          <div className="space-y-1">
            {navItems
              .filter((item) => item.label === "Dashboard")
              .map((item) => (
                <DashboardNavLink
                  key={item.label}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  active={isPathActive(pathname, item.href)}
                  collapsed={sidebarCollapsed}
                  onNavigate={closeMobile}
                />
              ))}

            {itemsNav?.children ? (
              <div>
                <Link
                  href={itemsNav.href}
                  onClick={() => closeMobile}
                  title={sidebarCollapsed ? itemsNav.label : undefined}
                  aria-current={
                    itemsNav.children.some((child) =>
                      isPathActive(pathname, child.href),
                    ) || isPathActive(pathname, itemsNav.href)
                      ? "page"
                      : undefined
                  }
                  className={cn(
                    "flex items-center gap-3 border-l-4 px-3 py-2 text-sm transition-colors",
                    itemsNav.children.some((child) =>
                      isPathActive(pathname, child.href),
                    ) || isPathActive(pathname, itemsNav.href)
                      ? "border-primary bg-sidebar-accent text-primary"
                      : "border-transparent text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
                    sidebarCollapsed && "justify-center px-2",
                  )}
                >
                  <Package className="size-4 shrink-0" />
                  {!sidebarCollapsed ? (
                    <>
                      <span>{itemsNav.label}</span>
                      <ChevronRight className="ml-auto size-4 opacity-40" />
                    </>
                  ) : null}
                </Link>

                {!sidebarCollapsed ? (
                  <div className="mt-1 space-y-1 pl-6">
                    {itemsNav.children.map((child) => {
                      const active = isPathActive(pathname, child.href);

                      return (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={(e) => {
                            e.stopPropagation();
                            closeMobile?.();
                          }}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "block border-l-4 py-1.5 pl-4 text-sm transition-colors",
                            active
                              ? "border-primary bg-sidebar-accent text-primary"
                              : "border-transparent text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
                          )}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            ) : null}

            {topLevelItems
              .filter((item) => item.label !== "Dashboard" && !item.children)
              .map((item) => (
                <DashboardNavLink
                  key={item.label}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  active={isPathActive(pathname, item.href)}
                  collapsed={sidebarCollapsed}
                  onNavigate={closeMobile}
                />
              ))}
          </div>
        </nav>

        {/* {!sidebarCollapsed ? <StorageUsedCard /> : null} */}

        <div
          className={cn(
            "border-t border-border p-3",
            sidebarCollapsed && "px-2",
          )}
        >
          <ProfileCard collapsed={sidebarCollapsed} />
        </div>
      </aside>
    </>
  );
}
