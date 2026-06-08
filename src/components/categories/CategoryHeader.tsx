import { Plus } from "lucide-react";

import Button from "@/components/ui/button";

type CategoryHeaderProps = {
  onAddCategory: () => void;
};

export default function CategoryHeader({ onAddCategory }: CategoryHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="label-caps">Inventory / Categories</div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
          Categories
        </h1>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
          Organize vendor coverage by inventory classification and keep the
          supplier network easy to scan.
        </p>
      </div>

      <Button
        type="button"
        className="h-11 gap-2 rounded-[10px] px-4"
        onClick={onAddCategory}
      >
        <Plus className="size-4" />
        Add Category
      </Button>
    </div>
  );
}
