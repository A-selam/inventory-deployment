import { Plus } from "lucide-react";
import Button from "@/components/ui/button";

type VendorHeaderProps = {
  onAddClick: () => void;
};

export default function VendorHeader({ onAddClick }: VendorHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      <Button
        onClick={onAddClick}
        className="h-11 shrink-0 gap-2 px-4 font-semibold"
      >
        <Plus className="size-5" />
        Add Supplier
      </Button>
    </div>
  );
}
