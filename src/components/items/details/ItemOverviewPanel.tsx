import Card from "@/components/ui/card";
import type { ItemDetail } from "@/types/items";

type ItemOverviewPanelProps = {
  item: ItemDetail;
};

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="label-caps text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

export default function ItemOverviewPanel({ item }: ItemOverviewPanelProps) {
  return (
    <Card className="rounded-[12px] border-border p-0 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative overflow-hidden border-b border-border bg-linear-to-br from-slate-50 via-white to-slate-100 p-6 lg:border-b-0 lg:border-r">
          <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-slate-900 via-slate-500 to-slate-300" />
          <div className="flex h-full flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  Technical snapshot
                </h2>
                <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                  {item.description ||
                    "No extended description was provided for this item. Core inventory attributes are shown alongside the live stock record."}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <DetailRow label="SKU" value={item.sku} />
              <DetailRow
                label="Location"
                value={item.bin_location || "Unknown"}
              />
            </div>
          </div>
        </div>

        <div className="space-y-0">
          <div className="border-b border-border p-6">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">
              Stock configuration
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Live thresholds and pricing values used by operations and
              replenishment.
            </p>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2">
            <DetailRow label="Current stock" value={`${item.quantity_on_hand}`} />
            <DetailRow
              label="Minimum stock"
              value={`${item.minimum_stock_level}`}
            />
            <DetailRow
              label="Selling price"
              value={`$${item.selling_price.toLocaleString("en-US")}`}
            />
          </div>

          {/* <div className="border-t border-border bg-muted/30 p-6">
            <p className="text-sm italic text-muted-foreground">
              Last updated{" "}
              {new Date(item.updated_at).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          </div> */}
        </div>
      </div>
    </Card>
  );
}
