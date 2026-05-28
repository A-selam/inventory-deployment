"use client";

import { Download, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TransactionHeader() {
  return (
    <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="mb-1 text-3xl font-bold tracking-tight text-foreground">Transaction History</h1>
        <p className="text-sm text-muted-foreground">
          Real-time immutable log of all warehouse movements and audits.
        </p>
      </div>

    </div>
  );
}
