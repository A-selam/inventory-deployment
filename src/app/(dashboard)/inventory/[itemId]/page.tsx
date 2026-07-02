"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

import EmptyState from "@/components/shared/EmptyState";
import ItemActivityTable from "@/components/items/details/ItemActivityTable";
import ItemDetailHeader from "@/components/items/details/ItemDetailHeader";
import ItemOverviewPanel from "@/components/items/details/ItemOverviewPanel";
import ItemSidebar from "@/components/items/details/ItemSidebar";
import ItemSummaryCards from "@/components/items/details/ItemSummaryCards";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteItem, useItem } from "@/hooks/useItems";
import { useVendor } from "@/hooks/useVendors";
import { useTransactionsListEnabled } from "@/hooks/useTransactions";
import UpdateItemDrawer from "@/components/items/update-item/UpdateItemDrawer";
import DeleteItemModal from "@/components/items/delete-item/DeleteItemModal";
import { useToast } from "@/providers/ToastProvider";
import type { ItemDetail } from "@/types/items";

export default function ItemDetailPage() {
  const params = useParams<{ itemId: string }>();
  const router = useRouter();
  const itemId = params.itemId;
  const { toast } = useToast();
  const deleteItemMutation = useDeleteItem();
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const {
    data: itemResponse,
    isLoading: isItemLoading,
    isError,
  } = useItem(itemId);

  const item: ItemDetail | undefined = itemResponse?.data;
  const { data: vendorResponse, isLoading: isVendorLoading } = useVendor(
    item?.vendor_id,
  );

  const transactionsQuery = useTransactionsListEnabled(
    {
      page: 1,
      limit: 5,
      search: item?.name,
    },
    Boolean(item?.name),
  );

  const rawTransactions = transactionsQuery.data?.data.data ?? [];
  const itemTransactions = [...rawTransactions]
    .sort(
      (left, right) =>
        +new Date(String(right.created_at ?? right.timestamp ?? "")) -
        +new Date(String(left.created_at ?? left.timestamp ?? "")),
    )
    .slice(0, 5);

  const currentStock = item?.quantity_on_hand ?? 0;
  const minimumStock = item?.minimum_stock_level ?? 0;
  const derivedStatusLabel =
    currentStock <= 0
      ? "Out of stock"
      : currentStock <= minimumStock
        ? "Low stock"
        : "In stock";
  const statusLabel = item?.status ?? derivedStatusLabel;
  const statusClassName = item?.status?.toLowerCase().includes("out")
    ? "bg-rose-50 text-rose-700"
    : item?.status?.toLowerCase().includes("low")
      ? "bg-amber-50 text-amber-700"
      : "bg-emerald-50 text-emerald-700";

  const handleDelete = async () => {
    if (!item) return;

    try {
      await deleteItemMutation.mutateAsync(item.id);
      toast({
        title: "Item deleted",
        description: `"${item.name}" was removed from inventory.`,
        variant: "success",
      });
      setDeleteOpen(false);
      router.push("/inventory");
    } catch {
      toast({
        title: "Failed to delete item",
        description: "Please try again.",
        variant: "error",
      });
    }
  };

  if (isItemLoading) {
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
        onUpdate={() => setUpdateOpen(true)}
        onDelete={() => setDeleteOpen(true)}
        onCreateTransaction={() =>
          router.push(`/inventory/${item.id}/transactions/new`)
        }
      />
      <ItemSummaryCards item={item} />

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <ItemOverviewPanel item={item} />
          <ItemActivityTable
            transactions={itemTransactions}
            isLoading={transactionsQuery.isLoading || transactionsQuery.isFetching}
          />
        </div>

        <div className="lg:col-span-4">
          <ItemSidebar
            item={item}
            vendor={vendorResponse?.data}
            isVendorLoading={isVendorLoading}
          />
        </div>
      </div>

      <UpdateItemDrawer
        open={updateOpen}
        onClose={() => setUpdateOpen(false)}
        item={item}
      />
      <DeleteItemModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        isDeleting={deleteItemMutation.isPending}
        item={item}
      />
    </div>
  );
}
