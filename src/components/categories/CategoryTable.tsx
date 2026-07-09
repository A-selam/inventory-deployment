import { FolderKanban, Plus } from "lucide-react";

import Card from "@/components/ui/card";
import type { Category } from "@/lib/categories";

import StandardDataTable, {
  StandardEmptyRow,
  StandardTableHeadCell,
} from "@/components/shared/StandardDataTable";

import CategoryRowActions from "./CategoryRowActions";

type CategoryTableProps = {
  categories: Category[];
  isLoading?: boolean;
  title?: string;
  filters?: React.ReactNode;
  filtersOpen?: boolean;
  onToggleFilters?: () => void;
  onAddCategory?: () => void;
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
        Add a category to get started.
      </p>
    </Card>
  );
}

export default function CategoryTable({
  categories,
  isLoading = false,
  title = "List of categories",
  filters,
  filtersOpen = false,
  onToggleFilters,
  onAddCategory,
}: CategoryTableProps) {
  const tableHead = (
    <>
      <StandardTableHeadCell className="whitespace-nowrap has-[[role=checkbox]]:pr-0">
        Category
      </StandardTableHeadCell>
      <StandardTableHeadCell className="whitespace-nowrap has-[[role=checkbox]]:pr-0">
        Vendors
      </StandardTableHeadCell>
      <StandardTableHeadCell className="w-24 pr-10 text-center">
        Actions
      </StandardTableHeadCell>
    </>
  );

  const tableBody = categories.map((category) => (
    <tr
      key={category.id}
      className="border-b transition-colors hover:bg-[#F8FAFC] dark:hover:bg-muted"
    >
      <td className="p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <div className="truncate font-semibold text-foreground">
              {category.name}
            </div>
          </div>
        </div>
      </td>
      <td className="p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="truncate">
            {category.vendor_total.toLocaleString()}
          </span>
        </div>
      </td>
      <td className="w-24 p-2 pr-5 align-middle text-center">
        <div className="flex items-center justify-center">
          <CategoryRowActions category={category} />
        </div>
      </td>
    </tr>
  ));

  return (
    <div>
      {/* Preserve existing skeleton/empty-state behavior, but standardize layout when data exists */}
      {isLoading ? (
        <CategoryTableSkeleton />
      ) : categories.length === 0 ? (
        <CategoryEmptyState />
      ) : (
        <StandardDataTable
          title={title}
          page={1}
          totalPages={1}
          totalItems={categories.length}
          limit={categories.length}
          isLoading={false}
          filters={filters}
          filtersOpen={filtersOpen}
          addAction={[
            {
              label: "Add Category",
              icon: <Plus className="size-4" />,
              onClick: onAddCategory ?? undefined,
              disabled: !onAddCategory,
            },
          ]}
          onToggleFilters={onToggleFilters}
          emptyState={{ title: "No categories found" }}
          tableHead={tableHead}
          tableBody={tableBody}
          pagination={{ onPageChange: undefined }}
        />
      )}
    </div>
  );
}
