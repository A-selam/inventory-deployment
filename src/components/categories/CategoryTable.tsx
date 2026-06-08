import { FolderKanban } from "lucide-react";

import Card from "@/components/ui/card";
import type { Category } from "@/lib/categories";

import CategoryRowActions from "./CategoryRowActions";

type CategoryTableProps = {
  categories: Category[];
  isLoading?: boolean;
};

function CategoryTableSkeleton() {
  return (
    <Card className="overflow-hidden rounded-[12px] border-border bg-card p-0 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="border-b border-border px-5 py-4">
        <div className="h-5 w-44 animate-pulse rounded bg-muted" />
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-[minmax(0,1fr)_140px] items-center gap-4 px-5 py-4"
          >
            <div className="flex items-center gap-3">
              <div className="size-9 animate-pulse rounded-[10px] bg-muted" />
              <div className="h-4 w-48 animate-pulse rounded bg-muted" />
            </div>
            <div className="h-7 w-16 animate-pulse rounded-full bg-muted" />
          </div>
        ))}
      </div>
    </Card>
  );
}

function CategoryEmptyState() {
  return (
    <Card className="rounded-[12px] border-border bg-card p-10 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="mx-auto flex size-14 items-center justify-center rounded-[14px] border border-border bg-muted text-muted-foreground">
        <FolderKanban className="size-6" />
      </div>
      <h2 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
        No categories found
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        Try a different search term or clear the filters to return to the full
        category list.
      </p>
    </Card>
  );
}

export default function CategoryTable({
  categories,
  isLoading = false,
}: CategoryTableProps) {
  if (isLoading) return <CategoryTableSkeleton />;

  if (categories.length === 0) return <CategoryEmptyState />;

  return (
    <Card className="overflow-hidden rounded-[12px] border-border bg-card p-0 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex flex-col gap-1 border-b border-border bg-card px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Category directory
          </h2>
          <p className="text-sm text-muted-foreground">
            Connected to the raw categories API response.
          </p>
        </div>
        <div className="label-caps">{categories.length} records</div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-150 text-left">
          <thead className="bg-muted/60">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Category
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Vendors
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.map((category) => (
              <tr
                key={category.id}
                className="transition-colors hover:bg-muted/45"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-[10px] bg-muted text-foreground">
                      <FolderKanban className="size-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">
                        {category.name}
                      </div>
                      <div className="font-mono text-xs text-muted-foreground">
                        {category.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-right">
                  <span className="inline-flex min-w-12 items-center justify-center rounded-full bg-secondary px-3 py-1 text-sm font-bold text-secondary-foreground">
                    {category.vendor_total.toLocaleString()}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <CategoryRowActions category={category} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
