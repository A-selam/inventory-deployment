"use client";

import Link from "next/link";
import { FileText, Info, Lightbulb, Tag } from "lucide-react";

import { Card } from "@/components/ui/card";

export default function ImportsGuidelinesSidebar() {
  return (
    <div className="space-y-6">
      <Card className="space-y-4 p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Info className="size-4 text-muted-foreground" />
          <p className="label-caps">Import Guidelines</p>
        </div>

        <div className="space-y-4">
          <div className="flex gap-3">
            <FileText className="mt-0.5 size-4 text-primary" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                Template available
              </p>
              <p className="text-sm text-muted-foreground">
                Download our{" "}
                <Link href="#" className="text-primary underline underline-offset-2">
                  CSV template
                </Link>{" "}
                to ensure data matches.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Tag className="mt-0.5 size-4 text-primary" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                Unique SKU Policy
              </p>
              <p className="text-sm text-muted-foreground">
                Duplicate SKUs will trigger an update to existing records.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="rounded-md border border-border bg-secondary p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Lightbulb className="size-4 text-muted-foreground" />
          <p className="label-caps">Pro Tip</p>
        </div>
        <p className="mt-3 text-sm text-foreground">
          You can map multiple warehouse locations in a single import file using
          the Location column.
        </p>
      </div>
    </div>
  );
}

