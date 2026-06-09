import { useState } from "react";
import { PackagePlus, RefreshCw, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import type { ItemDetail } from "@/types/items";
import type { Vendor } from "@/lib/vendors";
import { useDeleteItem } from "@/hooks/useItems";
import { useToast } from "@/providers/ToastProvider";
import UpdateItemDrawer from "@/components/items/update-item/UpdateItemDrawer";
import DeleteItemModal from "@/components/items/delete-item/DeleteItemModal";

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
  const router = useRouter();
  const { toast } = useToast();
  const deleteItemMutation = useDeleteItem();
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDelete = async () => {
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
            onClick={() => setUpdateOpen(true)}
          >
            <RefreshCw className="size-4" />
            Update item
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-auto justify-start gap-2 py-4 text-sm"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash className="size-4" />
            Delete
          </Button>
          <Button
            type="button"
            className="h-auto justify-start gap-2 py-4 text-sm"
          >
            <PackagePlus className="size-4" />
            Create transaction
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
            value={
              isVendorLoading ? "Loading..." : vendor?.name || item.vendor_id
            }
          />
          <MetaRow
            label="Contact"
            value={
              isVendorLoading
                ? "Loading..."
                : vendor?.contact_person.toString() || "Unknown"
            }
          />
          <MetaRow
            label="Location"
            value={
              isVendorLoading
                ? "Loading..."
                : vendor
                  ? `${vendor.location || "Unknown"}`
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
