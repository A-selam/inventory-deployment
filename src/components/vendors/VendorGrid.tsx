import { Building2 } from "lucide-react";

import Card from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Vendor } from "@/lib/vendors";

import VendorCard from "./VendorCard";

type VendorGridProps = {
  vendors: Vendor[];
  isLoading?: boolean;
  onEditVendor?: (vendor: Vendor) => void;
  onDeleteVendor?: (vendor: Vendor) => void;
};

function VendorGridSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card
          key={index}
          className="rounded-[12px] border-border bg-card p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
        >
          <div className="flex items-start justify-between">
            <Skeleton className="size-12 rounded-[12px]" />
            <Skeleton className="h-7 w-20 rounded-full" />
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-4 w-36" />
          </div>
          <div className="mt-5 space-y-4 border-t border-border pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </Card>
      ))}
    </div>
  );
}

function VendorEmptyState() {
  return (
    <Card className="rounded-[12px] border-border bg-card p-10 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="mx-auto flex size-14 items-center justify-center rounded-[14px] border border-border bg-muted text-muted-foreground">
        <Building2 className="size-6" />
      </div>
      <h2 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
        No suppliers found
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        Clear the filters to return to the full supplier list.
      </p>
    </Card>
  );
}

export default function VendorGrid({
  vendors,
  isLoading = false,
  onEditVendor,
  onDeleteVendor,
}: VendorGridProps) {
  if (isLoading) return <VendorGridSkeleton />;

  if (vendors.length === 0) return <VendorEmptyState />;

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {vendors.map((vendor) => (
        <VendorCard
          key={vendor.id}
          vendor={vendor}
          onEdit={onEditVendor}
          onDelete={onDeleteVendor}
        />
      ))}
    </div>
  );
}
