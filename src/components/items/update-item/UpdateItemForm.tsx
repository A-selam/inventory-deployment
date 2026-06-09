"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { z } from "zod";

import { useCategoriesList } from "@/hooks/useCategories";
import { useUpdateItem } from "@/hooks/useItems";
import { useVendorsList } from "@/hooks/useVendors";
import { getApiErrorMessage } from "@/lib/api-errors";
import { useToast } from "@/providers/ToastProvider";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import type { ItemDetail } from "@/types/items";

type UpdateItemFormValues = {
  name: string;
  description: string;
  minimum_stock_level: number;
  cost_price: number;
  selling_price: number;
  category_id: string;
  vendor_id: string;
  bin_location: string;
};

const updateItemSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional().default(""),
  minimum_stock_level: z.coerce
    .number()
    .int({ message: "Minimum stock level must be a whole number" })
    .min(0, { message: "Minimum stock level cannot be negative" }),
  cost_price: z.coerce
    .number()
    .min(0, { message: "Cost price cannot be negative" }),
  selling_price: z.coerce
    .number()
    .min(0, { message: "Selling price cannot be negative" }),
  category_id: z.string().min(1, { message: "Category is required" }),
  vendor_id: z.string().min(1, { message: "Vendor is required" }),
  bin_location: z.string().min(1, { message: "Bin location is required" }),
});

type UpdateItemFormProps = {
  item: ItemDetail;
  formId: string;
  onUpdated: () => void;
  onSubmittingChange: (value: boolean) => void;
};

export default function UpdateItemForm({
  item,
  formId,
  onUpdated,
  onSubmittingChange,
}: UpdateItemFormProps) {
  const { toast } = useToast();
  const updateItemMutation = useUpdateItem(item.id);
  const categoriesQuery = useCategoriesList();
  const vendorsQuery = useVendorsList({
    page: 1,
    limit: 250,
    sort_by: "name",
    sort_dir: "asc",
  });

  const defaults = useMemo<UpdateItemFormValues>(() => {
    return {
      name: item.name,
      description: item.description ?? "",
      minimum_stock_level: item.minimum_stock_level,
      cost_price: item.cost_price,
      selling_price: item.selling_price,
      category_id: item.category_id,
      vendor_id: item.vendor_id,
      bin_location: item.bin_location,
    };
  }, [item]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UpdateItemFormValues>({
    resolver: standardSchemaResolver(updateItemSchema) as never,
    defaultValues: defaults,
  });

  useEffect(() => {
    reset(defaults);
  }, [defaults, reset]);

  useEffect(() => {
    onSubmittingChange(updateItemMutation.isPending);
  }, [onSubmittingChange, updateItemMutation.isPending]);

  async function onSubmit(values: UpdateItemFormValues) {
    const name = values.name.trim();
    const description = values.description?.trim() ?? "";
    const binLocation = values.bin_location.trim();

    setValue("name", name, { shouldDirty: true, shouldValidate: true });
    setValue("description", description, { shouldDirty: true });
    setValue("bin_location", binLocation, {
      shouldDirty: true,
      shouldValidate: true,
    });

    try {
      await updateItemMutation.mutateAsync({
        name,
        description,
        minimum_stock_level: values.minimum_stock_level,
        cost_price: values.cost_price,
        selling_price: values.selling_price,
        category_id: values.category_id,
        vendor_id: values.vendor_id,
        bin_location: binLocation,
      });

      toast({
        title: "Item updated",
        description: `"${name}" was saved successfully.`,
        variant: "success",
      });
      onUpdated();
    } catch (error) {
      toast({
        title: "Failed to update item",
        description: getApiErrorMessage(error, "Please try again."),
        variant: "error",
      });
    }
  }

  const isSubmitting = updateItemMutation.isPending;
  const categories = categoriesQuery.data ?? [];
  const vendors = vendorsQuery.data?.data ?? [];

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(onSubmit)}
      className="flex-1 overflow-y-auto px-6 py-6"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor="update-item-name"
            className="label-caps text-foreground"
          >
            Name
          </Label>
          <Input
            id="update-item-name"
            placeholder="Item name"
            className="h-11 rounded-[10px] px-4"
            aria-invalid={Boolean(errors.name)}
            disabled={isSubmitting}
            {...register("name")}
          />
          {errors.name ? (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="update-item-description"
            className="label-caps text-foreground"
          >
            Description
          </Label>
          <textarea
            id="update-item-description"
            rows={3}
            placeholder="Brief description of the item"
            className="w-full resize-none rounded-[10px] border border-input bg-transparent px-4 py-2 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
            aria-invalid={Boolean(errors.description)}
            disabled={isSubmitting}
            {...register("description")}
          />
          {errors.description ? (
            <p className="text-xs text-destructive">
              {errors.description.message}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="update-item-min-stock"
              className="label-caps text-foreground"
            >
              Minimum Stock Level
            </Label>
            <Input
              id="update-item-min-stock"
              type="number"
              min={0}
              step="1"
              className="h-11 rounded-[10px] px-4"
              aria-invalid={Boolean(errors.minimum_stock_level)}
              disabled={isSubmitting}
              {...register("minimum_stock_level")}
            />
            {errors.minimum_stock_level ? (
              <p className="text-xs text-destructive">
                {errors.minimum_stock_level.message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="update-item-cost-price"
              className="label-caps text-foreground"
            >
              Cost Price
            </Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                $
              </span>
              <Input
                id="update-item-cost-price"
                type="number"
                step="0.01"
                min={0}
                placeholder="0.00"
                className="h-11 rounded-[10px] pl-7 pr-4"
                aria-invalid={Boolean(errors.cost_price)}
                disabled={isSubmitting}
                {...register("cost_price")}
              />
            </div>
            {errors.cost_price ? (
              <p className="text-xs text-destructive">
                {errors.cost_price.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="update-item-selling-price"
              className="label-caps text-foreground"
            >
              Selling Price
            </Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                $
              </span>
              <Input
                id="update-item-selling-price"
                type="number"
                step="0.01"
                min={0}
                placeholder="0.00"
                className="h-11 rounded-[10px] pl-7 pr-4"
                aria-invalid={Boolean(errors.selling_price)}
                disabled={isSubmitting}
                {...register("selling_price")}
              />
            </div>
            {errors.selling_price ? (
              <p className="text-xs text-destructive">
                {errors.selling_price.message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="update-item-category"
            className="label-caps text-foreground"
          >
            Category
          </Label>
          <select
            id="update-item-category"
            className="h-11 w-full rounded-[10px] border border-input bg-transparent px-3 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
            aria-invalid={Boolean(errors.category_id)}
            disabled={isSubmitting || categoriesQuery.isLoading}
            {...register("category_id")}
          >
            <option value="">
              {categoriesQuery.isLoading
                ? "Loading categories…"
                : "Select category"}
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category_id ? (
            <p className="text-xs text-destructive">
              {errors.category_id.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="update-item-vendor"
            className="label-caps text-foreground"
          >
            Vendor
          </Label>
          <select
            id="update-item-vendor"
            className="h-11 w-full rounded-[10px] border border-input bg-transparent px-3 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
            aria-invalid={Boolean(errors.vendor_id)}
            disabled={isSubmitting || vendorsQuery.isLoading}
            {...register("vendor_id")}
          >
            <option value="">
              {vendorsQuery.isLoading ? "Loading vendors…" : "Select vendor"}
            </option>
            {vendors.map((vendor) => (
              <option key={vendor.id} value={vendor.id}>
                {vendor.name}
              </option>
            ))}
          </select>
          {errors.vendor_id ? (
            <p className="text-xs text-destructive">
              {errors.vendor_id.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="update-item-bin-location"
            className="label-caps text-foreground"
          >
            Bin Location
          </Label>
          <Input
            id="update-item-bin-location"
            placeholder="e.g. A-12-04"
            className="h-11 rounded-[10px] px-4"
            aria-invalid={Boolean(errors.bin_location)}
            disabled={isSubmitting}
            {...register("bin_location")}
          />
          {errors.bin_location ? (
            <p className="text-xs text-destructive">
              {errors.bin_location.message}
            </p>
          ) : null}
        </div>

        {updateItemMutation.isError ? (
          <p className="text-sm text-destructive">
            {getApiErrorMessage(
              updateItemMutation.error,
              "Failed to update item",
            )}
          </p>
        ) : null}
      </div>
    </form>
  );
}
