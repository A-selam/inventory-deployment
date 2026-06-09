"use client";

import { useParams, useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

import EmptyState from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useItem } from "@/hooks/useItems";
import CreateTransactionHeader from "@/components/transactions/create-transaction/CreateTransactionHeader";
import CreateTransactionForm from "@/components/transactions/create-transaction/CreateTransactionForm";
import type { ItemDetail } from "@/types/items";

export default function CreateTransactionPage() {
  const params = useParams<{ itemId: string }>();
  const router = useRouter();
  const itemId = params.itemId;

  const { data: itemResponse, isLoading, isError } = useItem(itemId);
  const item: ItemDetail | undefined = itemResponse?.data;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-115 w-full" />
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
      <CreateTransactionHeader
        itemId={itemId}
        itemName={item.name}
        sku={item.sku}
      />

      <Card className="rounded-[14px] border-border p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <CreateTransactionForm
          itemId={itemId}
          itemName={item.name}
          currentStock={item.quantity_on_hand ?? 0}
        />
      </Card>
    </div>
  );
}
