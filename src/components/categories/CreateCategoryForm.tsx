"use client";

import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Loader2 } from "lucide-react";
import { z } from "zod";

import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import { useCreateCategory } from "@/hooks/useCategories";
import { getApiErrorMessage } from "@/lib/api-errors";
import { useToast } from "@/providers/ToastProvider";

type CreateCategoryValues = {
  name: string;
};

const createCategorySchema = z.object({
  name: z.string().min(1, { message: "Category name is required" }),
});

type CreateCategoryFormProps = {
  onCancel: () => void;
  onCreated: () => void;
};

export default function CreateCategoryForm({
  onCancel,
  onCreated,
}: CreateCategoryFormProps) {
  const { toast } = useToast();
  const createCategoryMutation = useCreateCategory();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateCategoryValues>({
    resolver: standardSchemaResolver(createCategorySchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: CreateCategoryValues) {
    const name = values.name.trim();
    if (!name) return;

    setValue("name", name, { shouldDirty: true, shouldValidate: true });

    try {
      await createCategoryMutation.mutateAsync({ name });
      toast({
        title: "Category created",
        description: `"${name}" is now available.`,
        variant: "success",
      });
      onCreated();
    } catch (error) {
      toast({
        title: "Failed to create category",
        description: getApiErrorMessage(error, "Please try again."),
        variant: "error",
      });
    }
  }

  const isSubmitting = createCategoryMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="category-name" className="label-caps text-foreground">
          Category Name
        </Label>
        <Input
          id="category-name"
          placeholder="e.g. Healthcare Logistics"
          className="h-11 rounded-xl px-4"
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
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
          <span>Create Category</span>
        </Button>
      </div>

      {createCategoryMutation.isError ? (
        <p className="text-sm text-destructive">
          {getApiErrorMessage(
            createCategoryMutation.error,
            "Failed to create category",
          )}
        </p>
      ) : null}
    </form>
  );
}
