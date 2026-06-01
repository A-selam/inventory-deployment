"use client";

import { Bell, Menu, Search, Settings } from "lucide-react";

import ProfileCard from "@/components/shared/ProfileCard";
import { useSidebar } from "@/components/layout/DashboardShell";
import { Input } from "@/components/ui/input";

export default function DashboardHeader() {
  const { setMobileOpen } = useSidebar();

  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-border bg-card px-4 sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-md text-muted-foreground hover:bg-muted lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
        >
          <Menu className="size-5" />
        </button>
        <div className="relative min-w-0 flex-1 max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Search inventory, orders, or imports"
            placeholder="Search inventory, orders, or imports..."
            className="h-10 bg-muted pl-10 text-foreground"
          />
        </div>
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
          className="hidden size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground sm:inline-flex"
          aria-label="Settings"
        >
          <Settings className="size-4" />
        </button>

        <ProfileCard />
      </div>
    </header>
  );
}
