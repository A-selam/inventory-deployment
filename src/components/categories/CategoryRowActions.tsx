"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import Button from "@/components/ui/button";
import type { Category } from "@/lib/categories";

import DeleteCategoryModal from "./DeleteCategoryModal";
import UpdateCategoryModal from "./UpdateCategoryModal";

type CategoryRowActionsProps = {
  category: Category;
};

export default function CategoryRowActions({ category }: CategoryRowActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 gap-2 rounded-[10px] px-3"
          onClick={() => setIsEditOpen(true)}
        >
          <Pencil className="size-4" />
          Edit
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 gap-2 rounded-[10px] border-destructive/30 text-destructive hover:bg-destructive/10"
          onClick={() => setIsDeleteOpen(true)}
        >
          <Trash2 className="size-4" />
          Delete
        </Button>
      </div>

      <UpdateCategoryModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        categoryId={category.id}
        initialName={category.name}
      />

      <DeleteCategoryModal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        categoryId={category.id}
        categoryName={category.name}
      />
    </>
  );
}
