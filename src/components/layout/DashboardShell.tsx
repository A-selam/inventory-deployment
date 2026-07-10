// "use client";

import { type ReactNode } from "react";

import DashboardGuard from "@/components/layout/DashboardGuard";
import DashboardHeader from "@/components/layout/DashboardHeader";
import DashboardSidebar from "@/components/layout/DashboardSidebar";

export default function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <DashboardGuard>
      <div className="flex h-dvh min-h-screen overflow-hidden bg-background">
        <DashboardSidebar />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-2 sm:p-3 lg:p-4 max-w-full">
            {children}
          </main>
        </div>
      </div>
    </DashboardGuard>
  );
}
