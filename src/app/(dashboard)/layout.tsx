import type { ReactNode } from "react";
import { Suspense } from "react";
import DashboardGuard from "@/components/layout/DashboardGuard";
import DashboardHeader from "@/components/layout/DashboardHeader";
import DashboardSidebar from "@/components/layout/DashboardSidebar";

export default function DashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <DashboardGuard>
        <div className="min-h-screen flex bg-background">
          <DashboardSidebar />

          <div className="flex min-w-0 flex-1 flex-col">
            <DashboardHeader />

            <main className="flex-1 overflow-auto p-8 max-w-container-max">
              {children}
            </main>
          </div>
        </div>
      </DashboardGuard>
    </Suspense>
  );
}
