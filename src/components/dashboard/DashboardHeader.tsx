import { Bell, Search, Settings } from "lucide-react";

import ProfileCard from "@/components/shared/ProfileCard";
import { Input } from "@/components/ui/input";

export default function DashboardHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="relative w-100 max-w-full">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
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
  );
}
