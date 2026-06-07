import { ArrowRight, Package } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ReplenishmentItem } from "@/lib/replenishment";

import {
  formatCurrency,
  getStockLevel,
  getStockLevelClass,
  getVendorInitials,
} from "./replenishment-utils";

type ReplenishmentVendorGroupProps = {
  vendorName: string;
  items: ReplenishmentItem[];
};

export default function ReplenishmentVendorGroup({
  vendorName,
  items,
}: ReplenishmentVendorGroupProps) {
  const vendorValue = items.reduce(
    (total, item) => total + item.estimated_cost,
    0,
  );

  return (
    <Card className="overflow-hidden rounded-[12px] border-border bg-card p-0 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex flex-col gap-4 border-b border-border bg-muted/30 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl border border-border bg-background text-sm font-semibold text-foreground">
            {getVendorInitials(vendorName) || "V"}
          </div>
          <div>
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              {vendorName}
            </h2>
            <p className="text-sm text-muted-foreground">
              {items.length} item{items.length === 1 ? "" : "s"} require a
              reorder review
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background px-4 py-3 lg:text-right">
          <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Vendor total
          </div>
          <div className="mt-1 text-lg font-semibold tracking-tight text-foreground">
            {formatCurrency(vendorValue)}
          </div>
        </div>
      </div>

      <div className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-background hover:bg-background">
              <TableHead className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Item details
              </TableHead>
              <TableHead className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Current stock
              </TableHead>
              <TableHead className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Threshold
              </TableHead>
              <TableHead className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Qty needed
              </TableHead>
              <TableHead className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Est. cost
              </TableHead>
              <TableHead className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => {
              const stockLevel = getStockLevel(
                item.current_stock,
                item.threshold,
              );

              return (
                <TableRow key={item.sku} className="hover:bg-muted/30">
                  <TableCell className="px-5 py-4 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                        <Package className="size-4" />
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="truncate font-medium text-foreground">
                          {item.item_name}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">
                          {item.sku}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 align-middle">
                    <div className="space-y-2">
                      <Badge className={getStockLevelClass(stockLevel)}>
                        {stockLevel}
                      </Badge>
                      <div className="font-mono text-sm text-foreground">
                        {item.current_stock} units
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 align-middle">
                    <div className="text-sm text-foreground">
                      Min: {item.threshold}
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 align-middle">
                    <div className="font-mono text-sm font-semibold text-foreground">
                      {item.qty_needed}
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 align-middle">
                    <div className="font-mono text-sm font-semibold text-foreground">
                      {formatCurrency(item.estimated_cost)}
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 align-middle text-right">
                    <Button type="button" size="sm" className="gap-2 px-4">
                      Quick reorder
                      <ArrowRight className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-3 p-4 lg:hidden">
        {items.map((item) => {
          const stockLevel = getStockLevel(item.current_stock, item.threshold);

          return (
            <div
              key={item.sku}
              className="rounded-xl border border-border bg-background p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <div className="font-medium text-foreground">
                    {item.item_name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.sku}
                  </div>
                </div>
                <Badge className={getStockLevelClass(stockLevel)}>
                  {stockLevel}
                </Badge>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Current stock
                  </div>
                  <div className="mt-1 font-mono text-foreground">
                    {item.current_stock}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Threshold
                  </div>
                  <div className="mt-1 font-mono text-foreground">
                    {item.threshold}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Qty needed
                  </div>
                  <div className="mt-1 font-mono text-foreground">
                    {item.qty_needed}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Est. cost
                  </div>
                  <div className="mt-1 font-mono text-foreground">
                    {formatCurrency(item.estimated_cost)}
                  </div>
                </div>
              </div>

              <Button type="button" size="sm" className="mt-4 w-full gap-2">
                Quick reorder
                <ArrowRight className="size-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
