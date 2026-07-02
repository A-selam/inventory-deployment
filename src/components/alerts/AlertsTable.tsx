import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Alert } from "@/lib/alerts";

function severityBadgeClass(severity: Alert["severity"]) {
  return severity === "critical"
    ? "border border-rose-200 bg-rose-50 text-rose-700"
    : "border border-amber-200 bg-amber-50 text-amber-700";
}

function severityIconClass(severity: Alert["severity"]) {
  return severity === "critical"
    ? "bg-rose-50 text-rose-700"
    : "bg-amber-50 text-amber-700";
}

function PaginationButton({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={disabled}
      className="h-9 gap-2 px-3"
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

type AlertsTableProps = {
  rows: Alert[];
  page: number;
  totalPages: number;
  limit: number;
  totalItems: number;
  isFetching?: boolean;
  lastUpdatedLabel?: string | null;
  onRefresh?: () => void;
  onPageChange?: (page: number) => void;
};

export default function AlertsTable({
  rows,
  page,
  totalPages,
  limit,
  totalItems,
  isFetching = false,
  lastUpdatedLabel,
  onRefresh,
  onPageChange,
}: AlertsTableProps) {
  return (
    <Card className="rounded-[12px] border border-border p-0 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="overflow-hidden rounded-md bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border bg-background px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-foreground">
              List of alerts
            </h2>
            <p className="text-xs text-muted-foreground">
              Showing page {page} of {totalPages} - {totalItems} total alerts -{" "}
              {limit} per page
              {lastUpdatedLabel ? ` - Updated ${lastUpdatedLabel}` : ""}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 gap-2 self-start sm:self-auto"
            onClick={onRefresh}
            disabled={!onRefresh || isFetching}
          >
            <RefreshCw className={cn("size-4", isFetching && "animate-spin")} />
            Refresh
          </Button>
        </div>

        <div className="max-h-[70vh] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-background shadow-sm [&_tr]:border-b">
              <TableRow className="border-b transition-colors hover:bg-[#F8FAFC] dark:hover:bg-muted">
                <TableHead className="sticky top-0 z-10 bg-background p-2 text-foreground">
                  Item
                </TableHead>
                <TableHead className="sticky top-0 z-10 bg-background p-2 text-foreground">
                  Severity
                </TableHead>
                <TableHead className="sticky top-0 z-10 bg-background p-2 text-foreground">
                  Stock
                </TableHead>
                <TableHead className="sticky top-0 z-10 bg-background p-2 text-foreground">
                  Threshold
                </TableHead>
                <TableHead className="sticky top-0 z-10 bg-background p-2 text-foreground">
                  Gap
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {rows.map((alert) => {
                const deficit = Math.max(0, alert.threshold - alert.stock);
                const ratio =
                  alert.threshold > 0
                    ? Math.max(0, Math.min(alert.stock / alert.threshold, 1))
                    : 0;

                return (
                  <TableRow
                    key={`${alert.item_name}-${alert.severity}-${alert.threshold}-${alert.stock}`}
                    className="border-b transition-colors hover:bg-[#F8FAFC] dark:hover:bg-muted"
                  >
                    <TableCell className="p-2 align-middle">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex size-9 shrink-0 items-center justify-center rounded-xl",
                            severityIconClass(alert.severity),
                          )}
                        >
                          <AlertTriangle className="size-4" />
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <div className="truncate font-medium text-foreground">
                            {alert.item_name}
                          </div>
                          <div className="truncate text-xs text-muted-foreground">
                            Stock is {deficit} below threshold
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="p-2 align-middle">
                      <Badge className={severityBadgeClass(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </TableCell>

                    <TableCell className="p-2 align-middle">
                      <span className="font-mono text-[13px] tracking-tight text-foreground">
                        {alert.stock}
                      </span>
                    </TableCell>

                    <TableCell className="p-2 align-middle">
                      <span className="font-mono text-[13px] tracking-tight text-foreground">
                        {alert.threshold}
                      </span>
                    </TableCell>

                    <TableCell className="p-2 align-middle">
                      <div className="space-y-1">
                        <div className="font-mono text-[13px] tracking-tight text-foreground">
                          +{deficit}
                        </div>
                        <div className="h-1.5 w-28 rounded-full bg-muted">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              alert.severity === "critical"
                                ? "bg-rose-500"
                                : "bg-amber-500",
                            )}
                            style={{ width: `${ratio * 100}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-3 border-t border-border bg-background px-4 py-3 sm:flex-row sm:items-center sm:justify-end">
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <PaginationButton
              disabled={page <= 1}
              onClick={() => onPageChange?.(page - 1)}
            >
              <ChevronLeft className="size-4" />
              Previous
            </PaginationButton>

            <PaginationButton
              disabled={page >= totalPages}
              onClick={() => onPageChange?.(page + 1)}
            >
              Next
              <ChevronRight className="size-4" />
            </PaginationButton>
          </div>
        </div>
      </div>
    </Card>
  );
}
