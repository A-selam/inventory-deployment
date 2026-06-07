"use client";

import { useParams, useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

import EmptyState from "@/components/shared/EmptyState";
import ItemActivityTable from "@/components/items/details/ItemActivityTable";
import ItemDetailHeader from "@/components/items/details/ItemDetailHeader";
import ItemOverviewPanel from "@/components/items/details/ItemOverviewPanel";
import ItemSidebar from "@/components/items/details/ItemSidebar";
import ItemSummaryCards from "@/components/items/details/ItemSummaryCards";
import { Skeleton } from "@/components/ui/skeleton";
import { useItem } from "@/hooks/useItems";
import { useVendor } from "@/hooks/useVendors";
import { useTransactionHistory } from "@/hooks/useTransactions";
import type { ItemDetail } from "@/types/items";

export default function ItemDetailPage() {
  const params = useParams<{ itemId: string }>();
  const router = useRouter();
  const itemId = params.itemId;

  const {
    data: itemResponse,
    isLoading: isItemLoading,
    isError,
  } = useItem(itemId);
  const { data: historyResponse, isLoading: isHistoryLoading } =
    useTransactionHistory();

  const item: ItemDetail | undefined = itemResponse?.data;
  const { data: vendorResponse, isLoading: isVendorLoading } = useVendor(
    item?.vendor,
  );

  const itemTransactions = (historyResponse?.data ?? [])
    .filter((transaction) => transaction.item_id === item?.id)
    .sort(
      (left, right) => +new Date(right.timestamp) - +new Date(left.timestamp),
    )
    .slice(0, 8);

  const currentStock = item?.stock ?? 0;
  const minimumStock = item?.minimum_stock_level ?? 0;
  const derivedStatusLabel =
    currentStock <= 0
      ? "Out of stock"
      : currentStock <= minimumStock
        ? "Low stock"
        : "In stock";
  const statusLabel = item?.Status ?? derivedStatusLabel;
  const statusClassName = item?.Status?.toLowerCase().includes("out")
    ? "bg-rose-50 text-rose-700"
    : item?.Status?.toLowerCase().includes("low")
      ? "bg-amber-50 text-amber-700"
      : "bg-emerald-50 text-emerald-700";

  if (isItemLoading || isHistoryLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
        <div className="grid gap-4 xl:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-105 w-full" />
      </div>
    );
  }

  if (isError || !item) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Item not found"
        description="We couldn’t load this item record. It may have been removed or the identifier is invalid."
        actionLabel="Back to inventory"
        onAction={() => router.push("/inventory")}
      />
    );
  }

  return (
    <div className="space-y-8">
      <ItemDetailHeader
        item={item}
        statusLabel={statusLabel}
        statusClassName={statusClassName}
      />
      <ItemSummaryCards item={item} />

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <ItemOverviewPanel item={item} />
          <ItemActivityTable transactions={itemTransactions} />
        </div>

        <div className="lg:col-span-4">
          <ItemSidebar
            item={item}
            vendor={vendorResponse?.data}
            isVendorLoading={isVendorLoading}
          />
        </div>
      </div>
    </div>
  );
}
