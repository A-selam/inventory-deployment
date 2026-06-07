import { PackagePlus, RefreshCw, Truck } from "lucide-react";

import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import type { ItemDetail } from "@/types/items";
import type { Vendor } from "@/lib/vendors";

type ItemSidebarProps = {
  item: ItemDetail;
  vendor?: Vendor;
  isVendorLoading?: boolean;
};

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

export default function ItemSidebar({
  item,
  vendor,
  isVendorLoading = false,
}: ItemSidebarProps) {
  return (
    <div className="space-y-6">
      <Card className="rounded-[12px] border-border p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          Quick actions
        </h3>
        <div className="mt-4 grid gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-auto justify-start gap-2 py-4 text-sm"
          >
            <RefreshCw className="size-4" />
            Update item
          </Button>
          <Button
            type="button"
            className="h-auto justify-start gap-2 py-4 text-sm"
          >
            <PackagePlus className="size-4" />
            Create transaction
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-auto justify-start gap-2 py-4 text-sm"
          >
            <Truck className="size-4" />
            Replenishment
          </Button>
        </div>
      </Card>

      <Card className="rounded-[12px] border-border p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          Vendor and stock info
        </h3>
        <div className="mt-4 divide-y divide-border">
          <MetaRow
            label="Vendor"
            value={isVendorLoading ? "Loading..." : vendor?.name || item.vendor}
          />
          <MetaRow
            label="Contact"
            value={
              isVendorLoading
                ? "Loading..."
                : vendor?.contact_person || "Unknown"
            }
          />
          <MetaRow
            label="Location"
            value={
              isVendorLoading
                ? "Loading..."
                : vendor
                  ? `${vendor.location.city}, ${vendor.location.country}`
                  : "Unknown"
            }
          />
          <MetaRow
            label="Lead time"
            value={
              isVendorLoading
                ? "Loading..."
                : vendor
                  ? `${vendor.lead_time} days`
                  : "Unknown"
            }
          />
        </div>
      </Card>
    </div>
  );
}
