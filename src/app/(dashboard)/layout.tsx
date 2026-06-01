import type { ReactNode } from "react";
import { Suspense } from "react";

import DashboardShell from "@/components/layout/DashboardShell";

export default function DashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <DashboardShell>{children}</DashboardShell>
    </Suspense>
  );
}
