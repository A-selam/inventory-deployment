"use client";

import { useMemo } from "react";
import { CheckCircle2 } from "lucide-react";

import Button from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export default function ImportsSuccessCard({
  records,
  onViewInventory,
  onImportAnother,
}: {
  records: number;
  onViewInventory: () => void;
  onImportAnother: () => void;
}) {
  const formatted = useMemo(() => formatNumber(records), [records]);

  return (
    <Card className="p-0 shadow-sm">
      <div className="flex flex-col items-center gap-5 px-6 py-16 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="size-10" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">
            Import Complete
          </h2>
          <p className="text-base font-medium text-muted-foreground">
            Successfully imported {formatted} records
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button type="button" onClick={onViewInventory}>
            View Inventory
          </Button>
          <Button type="button" variant="outline" onClick={onImportAnother}>
            Import Another File
          </Button>
        </div>
      </div>
    </Card>
  );
}

