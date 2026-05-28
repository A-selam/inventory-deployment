"use client";

import { Download, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TransactionHeader() {
  return (
    <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <nav className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <span>Inventory</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-primary">Transaction Ledger</span>
        </nav>
        <h1 className="mb-1 text-3xl font-bold tracking-tight text-foreground">Transaction History</h1>
        <p className="text-sm text-muted-foreground">
          Real-time immutable log of all warehouse movements and audits.
        </p>
      </div>

      <div className="flex w-full gap-3 sm:w-auto sm:flex-shrink-0">
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="size-4" />
          <span className="hidden sm:inline">Filters</span>
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="size-4" />
          <span className="hidden sm:inline">Export CSV</span>
        </Button>
        <Button size="sm" className="gap-2">
          <Plus className="size-4" />
          <span className="hidden sm:inline">New Transaction</span>
        </Button>
      </div>
    </div>
  );
}
