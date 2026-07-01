"use client";

import { useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import { useWarehouse } from "@/hooks/useWarehouses";

import DeleteWarehouseModal from "./DeleteWarehouseModal";
import UpdateWarehouseModal from "./UpdateWarehouseModal";
import WarehouseDetailHeader from "./WarehouseDetailHeader";
import WarehouseOverviewCards from "./WarehouseOverviewCards";
import { formatWarehouseDate } from "./warehouses-utils";

type WarehouseDetailsPageClientProps = {
  warehouseId?: string;
};

function WarehouseDetailSkeleton() {
  return (
    <div className="space-y-8">
      <Card className="rounded-[12px] border-border bg-card p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="space-y-4">
          <div className="h-5 w-40 animate-pulse rounded bg-muted" />
          <div className="h-9 w-72 animate-pulse rounded bg-muted" />
          <div className="h-4 w-full max-w-2xl animate-pulse rounded bg-muted" />
        </div>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="h-[220px] rounded-[12px] border-border bg-card p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="h-[160px] rounded-[12px] border-border bg-card p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]" />
          <Card className="h-[160px] rounded-[12px] border-border bg-card p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]" />
          <Card className="h-[160px] rounded-[12px] border-border bg-card p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:col-span-2" />
        </div>
      </div>
    </div>
  );
}

export default function WarehouseDetailsPageClient({
  warehouseId,
}: WarehouseDetailsPageClientProps) {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const normalizedWarehouseId =
    warehouseId && warehouseId !== "undefined" ? warehouseId : undefined;

  const warehouseQuery = useWarehouse(normalizedWarehouseId);
  const warehouse = warehouseQuery.data;

  const meta = useMemo(() => {
    if (!warehouse) return null;
    return {
      createdAt: formatWarehouseDate(warehouse.created_at),
      id: warehouse.id,
    };
  }, [warehouse]);

  if (!normalizedWarehouseId) {
    return (
      <Card className="rounded-[12px] border-border bg-card p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="label-caps">Invalid warehouse</div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              We could not load this warehouse because the URL is missing an ID.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="h-11 gap-2 px-4"
            onClick={() => router.push("/warehouses")}
          >
            Back
          </Button>
        </div>
      </Card>
    );
  }

  if (warehouseQuery.isLoading) return <WarehouseDetailSkeleton />;

  if (warehouseQuery.isError || !warehouse) {
    return (
      <Card className="rounded-[12px] border-border bg-card p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="label-caps">Warehouse unavailable</div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {warehouseQuery.isError
                ? warehouseQuery.error.message ||
                  "We could not load this warehouse right now."
                : "We could not find this warehouse."}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 gap-2 px-4"
              onClick={() => router.push("/warehouses")}
            >
              Back
            </Button>
            <Button
              type="button"
              className="h-11 gap-2 px-4"
              onClick={() => warehouseQuery.refetch()}
            >
              <RefreshCw className="size-4" />
              Retry
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <WarehouseDetailHeader
        warehouse={warehouse}
        onEdit={() => setIsEditOpen(true)}
        onDelete={() => setIsDeleteOpen(true)}
      />

      <WarehouseOverviewCards warehouse={warehouse} />

      {meta ? (
        <Card className="rounded-[12px] border-border bg-card p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="label-caps">Warehouse ID</div>
              <div className="mt-2 font-mono text-sm text-foreground">
                {meta.id}
              </div>
            </div>
            <div className="md:text-right">
              <div className="label-caps">Created</div>
              <div className="mt-2 text-sm text-foreground">
                {meta.createdAt}
              </div>
            </div>
          </div>
        </Card>
      ) : null}

      <UpdateWarehouseModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        warehouseId={warehouse.id}
        initialName={warehouse.name}
        initialLocation={warehouse.location}
        initialCapacity={warehouse.capacity}
        initialDescription={warehouse.description}
      />

      <DeleteWarehouseModal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        warehouseId={warehouse.id}
        warehouseName={warehouse.name}
        onDeleted={() => router.push("/warehouses")}
      />
    </div>
  );
}
