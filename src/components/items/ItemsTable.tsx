"use client";

import Link from "next/link";
import { Plus, SlidersHorizontal, Upload } from "lucide-react";

import Button from "@/components/ui/button";
import type { Item } from "@/lib/items";

import StandardDataTable, {
  StandardEmptyRow,
  StandardTableHeadCell,
} from "@/components/shared/StandardDataTable";

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

type ItemsTableProps = {
  items: Item[];
  isLoading?: boolean;
  page?: number;
  totalPages?: number;
  limit?: number;
  totalItems?: number;
  title?: string;
  filters?: React.ReactNode;
  filtersOpen?: boolean;
  onToggleFilters?: () => void;
  onImport?: () => void;
  onAddItem?: () => void;
  onPageChange?: (page: number) => void;
};

function StockStatusBadge({
  quantity,
  minimum,
}: {
  quantity: number;
  minimum: number;
}) {
  if (quantity <= 0) {
    return (
      <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
        Out of Stock
      </span>
    );
  }
  if (quantity <= minimum) {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
        Low Stock
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
      In Stock
    </span>
  );
}

export default function ItemsTable({
  items,
  isLoading = false,
  page = 1,
  totalPages = 1,
  limit = 20,
  totalItems = 0,
  title = "List of items",
  filters,
  filtersOpen = false,
  onToggleFilters,
  onImport,
  onAddItem,
  onPageChange,
}: ItemsTableProps) {
  const tableHead = (
    <>
      <StandardTableHeadCell className="whitespace-nowrap has-[[role=checkbox]]:pr-0">SKU</StandardTableHeadCell>
      <StandardTableHeadCell className="whitespace-nowrap has-[[role=checkbox]]:pr-0">Name</StandardTableHeadCell>
      <StandardTableHeadCell className="whitespace-nowrap has-[[role=checkbox]]:pr-0">Quantity</StandardTableHeadCell>
      <StandardTableHeadCell className="whitespace-nowrap has-[[role=checkbox]]:pr-0">Status</StandardTableHeadCell>
      <StandardTableHeadCell className="whitespace-nowrap has-[[role=checkbox]]:pr-0">Cost Price</StandardTableHeadCell>
      <StandardTableHeadCell className="whitespace-nowrap has-[[role=checkbox]]:pr-0">Selling Price</StandardTableHeadCell>
      <StandardTableHeadCell className="whitespace-nowrap has-[[role=checkbox]]:pr-0">Location</StandardTableHeadCell>
    </>
  );

  const tableBody = !items || items.length === 0 ? (
    <StandardEmptyRow colSpan={7} title="No items found" />
  ) : (
    items.map((item) => {
      const quantity = item.quantity_on_hand;
      const minimum = item.minimum_stock_level;
      const cost = item.cost_price;
      const selling = item.selling_price;
      const location = item.bin_location;

      return (
        <tr
          key={item.id}
          className="border-b transition-colors hover:bg-[#F8FAFC] dark:hover:bg-muted"
        >
          <td className="p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0 font-mono text-xs font-semibold text-primary">
            <Link className="hover:underline" href={`/inventory/${item.id}`}>
              {item.sku}
            </Link>
          </td>
          <td className="p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0">
            <Link
              className="font-semibold text-foreground underline"
              href={`/inventory/${item.id}`}
            >
              {item.name}
            </Link>
          </td>
          <td className="p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0">
            <span className="font-mono font-bold text-foreground">{quantity}</span>
          </td>
          <td className="p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0">
            <StockStatusBadge quantity={quantity} minimum={minimum} />
          </td>
          <td className="p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0 text-foreground">
            {formatCurrency(cost)}
          </td>
          <td className="p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0 text-foreground">
            {formatCurrency(selling)}
          </td>
          <td className="p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0 text-muted-foreground">
            {location}
          </td>
        </tr>
      );
    })
  );

  return (
    <StandardDataTable
      title={title}
      page={page}
      totalPages={totalPages}
      totalItems={totalItems}
      itemsCount={items.length}
      limit={limit}
      isLoading={isLoading}
      filters={filters}
      filtersOpen={filtersOpen}
      onToggleFilters={onToggleFilters}
      emptyState={{ title: "No items found" }}
      tableHead={tableHead}
      tableBody={tableBody}
      pagination={{ onPageChange }}
    />
  );
}
