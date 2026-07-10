"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, PackagePlus, SquarePen, Trash } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/button";
import type { ItemDetail } from "@/types/items";
import { cn } from "@/lib/utils";

const DESCRIPTION_MAX_LENGTH = 100;

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
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const shouldTruncate =
    item.description && item.description.length > DESCRIPTION_MAX_LENGTH;
  const displayDescription =
    shouldTruncate && !isDescriptionExpanded
      ? `${item.description!.slice(0, DESCRIPTION_MAX_LENGTH)}...`
      : item.description;

  return (
    <section className="sticky top-0 z-10 -mx-2 px-2 py-3 bg-background/95 bg-muted border-b border-border/50 mb-3 sm:-mx-3 sm:px-3 lg:-mx-4 lg:px-4">
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
              <div className="max-w-3xl">
                <p className="text-sm leading-6 text-muted-foreground sm:text-base">
                  {displayDescription}
                </p>
                {shouldTruncate && (
                  <button
                    type="button"
                    className="mt-1 text-sm font-medium text-primary hover:underline"
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  >
                    {isDescriptionExpanded ? "See less" : "See more"}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* <div className="flex flex-wrap items-center gap-3">
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
          </div> */}
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-nowrap">
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
