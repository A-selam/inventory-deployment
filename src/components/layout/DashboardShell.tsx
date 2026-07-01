"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

import DashboardGuard from "@/components/layout/DashboardGuard";
import DashboardHeader from "@/components/layout/DashboardHeader";
import DashboardSidebar from "@/components/layout/DashboardSidebar";

type SidebarContextValue = {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within DashboardShell");
  }
  return context;
}

export default function DashboardShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <SidebarContext.Provider
      value={{ collapsed, setCollapsed, mobileOpen, setMobileOpen }}
    >
      <DashboardGuard>
        <div className="flex h-dvh min-h-screen overflow-hidden bg-background">
          <DashboardSidebar />

          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <DashboardHeader />
            <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 max-w-container-max">
              {children}
            </main>
          </div>
        </div>
      </DashboardGuard>
    </SidebarContext.Provider>
  );
}
