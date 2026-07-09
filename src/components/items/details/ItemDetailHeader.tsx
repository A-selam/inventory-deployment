"use client";

import Link from "next/link";
import { ArrowLeft, PackagePlus, SquarePen, Trash } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/button";
import type { ItemDetail } from "@/types/items";
import { cn } from "@/lib/utils";

type ItemDetailHeaderProps = {
  item: ItemDetail;
  statusLabel: string;
  statusClassName: string;
  onUpdate?: () => void;
  onDelete?: () => void;
  onCreateTransaction?: () => void;
};

export default function ItemDetailHeader({
  item,
  statusLabel,
  statusClassName,
  onUpdate,
  onDelete,
  onCreateTransaction,
}: ItemDetailHeaderProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <Link
          href="/inventory"
          className="inline-flex items-center gap-1 hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to inventory
        </Link>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-3">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {item.name}
            </h1>
            {item.description && (
              <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
                {item.description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge className="bg-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {item.sku}
            </Badge>
            <Badge
              className={cn(
                "px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]",
                statusClassName,
              )}
            >
              {statusLabel}
            </Badge>
            <Badge className="bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-700">
              {item.bin_location}
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-start gap-2 lg:justify-end">
          <Button
            type="button"
            variant="default"
            size="sm"
            className="h-9 gap-2 hover:cursor-pointer border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100"
            onClick={onUpdate}
            disabled={!onUpdate}
          >
            <SquarePen className="size-4" />
            Edit
          </Button>

          <Button
            type="button"
            variant="default"
            size="sm"
            className="h-9 gap-2 hover:cursor-pointer bg-rose-600 text-white hover:bg-rose-700"
            onClick={onDelete}
            disabled={!onDelete}
          >
            <Trash className="size-4" />
            Delete
          </Button>

          <Button
            type="button"
            size="sm"
            className="h-9 gap-2 hover:cursor-pointer"
            onClick={onCreateTransaction}
            disabled={!onCreateTransaction}
          >
            <PackagePlus className="size-4" />
            Transaction
          </Button>
        </div>
      </div>
    </section>
  );
}
