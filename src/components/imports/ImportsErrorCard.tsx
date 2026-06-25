"use client";

import { useMemo } from "react";
import { AlertTriangle, Download, Upload } from "lucide-react";

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
import type { ImportCsvError } from "@/lib/imports";

function buildCsv(errors: ImportCsvError[]) {
  const header = ["row", "field", "message"];
  const rows = errors.map((err) => [
    String(err.row ?? ""),
    String(err.field ?? ""),
    String(err.message ?? ""),
  ]);

  const escapeCell = (cell: string) => {
    const value = cell.replaceAll('"', '""');
    return `"${value}"`;
  };

  return [header, ...rows].map((row) => row.map(escapeCell).join(",")).join("\n");
}

export default function ImportsErrorCard({
  errors,
  onReupload,
  fileName,
}: {
  errors: ImportCsvError[];
  onReupload: () => void;
  fileName?: string | null;
}) {
  const summary = useMemo(() => {
    const count = errors.length;
    return `Validation Failed: ${count} issue${count === 1 ? "" : "s"} found in your file.`;
  }, [errors.length]);

  const downloadLog = () => {
    const csv = buildCsv(errors);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const safeName = (fileName || "import-errors").replaceAll(/\.[^/.]+$/g, "");
    a.href = url;
    a.download = `${safeName}-errors.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="overflow-hidden border-destructive/30 p-0 shadow-sm">
      <div className="flex items-center gap-3 border-b border-destructive/20 bg-destructive/10 px-6 py-4">
        <AlertTriangle className="size-4 text-destructive" />
        <p className="text-sm font-semibold text-foreground">{summary}</p>
      </div>

      <div className="space-y-5 p-6">
        <div className="overflow-hidden rounded-md border border-destructive/15 bg-destructive/5">
          <Table>
            <TableHeader>
              <TableRow className="bg-destructive/5">
                <TableHead className="px-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Row Number
                </TableHead>
                <TableHead className="px-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Field Name
                </TableHead>
                <TableHead className="px-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Error Message
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {errors.map((err, idx) => (
                <TableRow key={`${err.row}-${err.field}-${idx}`}>
                  <TableCell className="px-4 text-sm text-foreground">
                    Row {err.row}
                  </TableCell>
                  <TableCell className="px-4 text-sm font-semibold text-foreground">
                    {err.field || "—"}
                  </TableCell>
                  <TableCell className="px-4 text-sm text-foreground">
                    {err.message || "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" onClick={onReupload} className="gap-2">
            <Upload className="size-4" />
            Re-upload CSV
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={downloadLog}
            className="gap-2"
            disabled={!errors.length}
          >
            <Download className="size-4" />
            Download Error Log
          </Button>
        </div>
      </div>
    </Card>
  );
}

