import Card from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
          Vendor and stock info
        </h3>
        {isVendorLoading ? (
          <div className="mt-4 space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
        ) : (
          <div className="mt-4 divide-y divide-border">
            <MetaRow label="Vendor" value={vendor?.name || item.vendor_id} />
            <MetaRow
              label="Contact"
              value={vendor?.contact_person?.toString() || "Unknown"}
            />
            <MetaRow
              label="Location"
              value={vendor ? `${vendor.location || "Unknown"}` : "Unknown"}
            />
            <MetaRow
              label="Lead time"
              value={vendor ? `${vendor.lead_time} days` : "Unknown"}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
