import { Plus } from "lucide-react";
import Button from "@/components/ui/button";

type VendorHeaderProps = {
  onAddClick: () => void;
};

export default function VendorHeader({ onAddClick }: VendorHeaderProps) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Vendors
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            Manage supplier contacts, locations, status, and lead time
            performance across the warehouse network.
          </p>
        </div>

        <Button
          onClick={onAddClick}
          className="h-11 shrink-0 gap-2 px-4 font-semibold"
        >
          <Plus className="size-5" />
          Add Vendor
        </Button>
      </div>
    </div>
  );
}
