"use client";

import Link from "next/link";
import { Download, FileText, RefreshCw } from "lucide-react";

import { useImportHistory } from "@/hooks/useImports";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import Button from "@/components/ui/button";
import type { ImportHistoryEntry } from "@/lib/imports";
import { cn } from "@/lib/utils";

function parseDate(value: string | null | undefined) {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDate(value: string | null | undefined) {
  const date = parseDate(value);
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatNumber(value: number | null | undefined) {
  if (typeof value !== "number") return "—";
  return new Intl.NumberFormat("en-US").format(value);
}

function normalizeStatus(status: string) {
  const raw = status.trim().toLowerCase();
  if (!raw) return "unknown";
  if (raw.includes("success")) return "success";
  if (raw.includes("fail")) return "failed";
  if (raw.includes("partial")) return "partial";
  return raw;
}

function statusBadgeClass(status: string) {
  const normalized = normalizeStatus(status);
  if (normalized === "success") {
    return "border border-emerald-200 bg-emerald-100 text-emerald-800";
  }
  if (normalized === "failed") {
    return "border border-red-200 bg-red-100 text-red-800";
  }
  if (normalized === "partial") {
    return "border border-amber-200 bg-amber-100 text-amber-800";
  }
  return "border border-border bg-muted text-foreground";
}

function actionForEntry(entry: ImportHistoryEntry) {
  const normalized = normalizeStatus(entry.status);
  if (entry.file_link) return "download";
  if (normalized === "failed") return "retry";
  return "view";
}

function ActionIcon({ entry }: { entry: ImportHistoryEntry }) {
  const action = actionForEntry(entry);
  if (action === "download") return <Download className="size-4" />;
  if (action === "retry") return <RefreshCw className="size-4" />;
  return <FileText className="size-4" />;
}

export default function ImportsRecentHistoryCard() {
  const historyQuery = useImportHistory({ page: 1, limit: 20 });
  const entries = historyQuery.data ?? [];

  return (
    <Card className="overflow-hidden p-0 shadow-sm" id="history">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <p className="label-caps">Recent Imports</p>
        <Link
          href="/imports"
          className="text-sm font-semibold text-primary hover:underline underline-offset-2"
        >
          View all history
        </Link>
      </div>

      {historyQuery.isLoading ? (
        <div className="space-y-3 p-6">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
        </div>
      ) : historyQuery.isError ? (
        <div className="flex items-center justify-between gap-4 p-6">
          <p className="text-sm text-muted-foreground">
            We could not load import history right now.
          </p>
          <Button type="button" variant="outline" size="sm" onClick={() => historyQuery.refetch()}>
            Retry
          </Button>
        </div>
      ) : entries.length ? (
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="px-6 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Filename
              </TableHead>
              <TableHead className="px-6 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Date
              </TableHead>
              <TableHead className="px-6 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Records
              </TableHead>
              <TableHead className="px-6 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="px-6 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <span className="sr-only">Action</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.slice(0, 8).map((entry) => {
              const action = actionForEntry(entry);
              const href =
                action === "download" && entry.file_link ? entry.file_link : "/imports";

              return (
                <TableRow key={`${entry.file_name}-${entry.date}`} className="hover:bg-muted/30">
                  <TableCell className="px-6 font-medium text-foreground">
                    {entry.file_name}
                  </TableCell>
                  <TableCell className="px-6 text-muted-foreground">
                    {formatDate(entry.date)}
                  </TableCell>
                  <TableCell className="px-6 text-muted-foreground">
                    {formatNumber(entry.records)}
                  </TableCell>
                  <TableCell className="px-6">
                    <Badge className={cn("px-2.5 py-1 text-xs", statusBadgeClass(entry.status))}>
                      {entry.status || "Unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 text-right">
                    <a
                      href={href}
                      target={action === "download" ? "_blank" : undefined}
                      rel={action === "download" ? "noreferrer" : undefined}
                      className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                      aria-label={action === "download" ? "Download file" : "View details"}
                    >
                      <ActionIcon entry={entry} />
                    </a>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <div className="p-6">
          <p className="text-sm text-muted-foreground">
            No imports yet. Upload a CSV to get started.
          </p>
        </div>
      )}
    </Card>
  );
}

