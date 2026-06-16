"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";

type CreateTransactionHeaderProps = {
  itemId: string;
  itemName: string;
  sku?: string;
};

export default function CreateTransactionHeader({
  itemId,
  itemName,
  sku,
}: CreateTransactionHeaderProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <Link
          href={`/inventory/${itemId}`}
          className="inline-flex items-center gap-1 hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to item
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            New Transaction
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Update stock for <span className="font-medium">{itemName}</span>.
          </p>
        </div>
        {sku ? (
          <div className="flex items-center gap-2">
            <Badge className="bg-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {sku}
            </Badge>
          </div>
        ) : null}
      </div>
    </section>
  );
}

