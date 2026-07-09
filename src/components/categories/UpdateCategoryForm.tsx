"use client";

import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import { useUpdateCategory } from "@/hooks/useCategories";
import { getApiErrorMessage } from "@/lib/api-errors";
import { useToast } from "@/providers/ToastProvider";

type UpdateCategoryValues = {
  name: string;
};

const updateCategorySchema = z.object({
  name: z
    .string()
    .min(1, { message: "Category name is required" })
    .max(25, { message: "Category name cannot exceed 25 characters" }),
});

type UpdateCategoryFormProps = {
  categoryId: string;
  initialName: string;
  onCancel: () => void;
  onUpdated: () => void;
};

export default function UpdateCategoryForm({
  categoryId,
  initialName,
  onCancel,
  onUpdated,
}: UpdateCategoryFormProps) {
  const { toast } = useToast();
  const updateCategoryMutation = useUpdateCategory(categoryId);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm<UpdateCategoryValues>({
    resolver: standardSchemaResolver(updateCategorySchema),
    defaultValues: {
      name: initialName,
    },
  });

  async function onSubmit(values: UpdateCategoryValues) {
    const name = values.name.trim();
    if (!name) return;

    setValue("name", name, { shouldDirty: true, shouldValidate: true });

    try {
      await updateCategoryMutation.mutateAsync({ name });
      toast({
        title: "Category updated",
        description: `"${name}" has been saved.`,
        variant: "success",
      });
      onUpdated();
    } catch (error) {
      toast({
        title: "Failed to update category",
        description: getApiErrorMessage(error, "Please try again."),
        variant: "error",
      });
    }
  }

  const isSubmitting = updateCategoryMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label
          htmlFor="update-category-name"
          className="label-caps text-foreground"
        >
          Category Name
        </Label>
        <Input
          id="update-category-name"
          placeholder="e.g. Electronics"
          className="h-9 rounded-md px-3"
          autoFocus
          aria-invalid={Boolean(errors.name)}
          disabled={isSubmitting}
          {...register("name")}
        />
        {errors.name ? (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        ) : null}
      </div>

      <div className="flex justify-end gap-3 pt-1">
        <Button
          type="button"
          variant="outline"
          className="h-11 rounded-xl px-5"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="h-11 rounded-xl px-5"
          disabled={isSubmitting || !isDirty}
        >
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
          <span>Update</span>
        </Button>
      </div>

      {updateCategoryMutation.isError ? (
        <p className="text-sm text-destructive">
          {getApiErrorMessage(
            updateCategoryMutation.error,
            "Failed to update category",
          )}
        </p>
      ) : null}
    </form>
  );
}
