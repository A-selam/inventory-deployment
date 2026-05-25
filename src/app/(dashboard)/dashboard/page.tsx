// import { Plus } from "lucide-react";

import DashboardClient from "../../../components/dashboard/dashboard-client";
// import Button from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl mb-0">
            Warehouse Dashboard
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Real-time overview of your global inventory operations.
          </p>
        </div>
        {/* 
        <Button className="inline-flex h-11 items-center gap-2 self-start bg-[#0B0F14] px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#111827] lg:self-auto">
          <Plus className="size-4" />
          New Movement
        </Button> */}
      </section>

      <DashboardClient />
    </div>
  );
}
