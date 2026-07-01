import { Plus } from "lucide-react";

import Button from "@/components/ui/button";

type CategoryHeaderProps = {
  onAddCategory: () => void;
};

export default function CategoryHeader({ onAddCategory }: CategoryHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
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
