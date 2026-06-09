"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";

export type CreateItemFormValues = {
  sku: string;
  name: string;
  description: string;
  initial_stock: number;
  minimum_stock_level: number;
  cost_price: number;
  selling_price: number;
  category_id: string;
  vendor_id: string;
  bin_location: string;
};

type CreateItemBasicInfoSectionProps = {
  register: UseFormRegister<CreateItemFormValues>;
  errors: FieldErrors<CreateItemFormValues>;
  disabled: boolean;
};

export default function CreateItemBasicInfoSection({
  register,
  errors,
  disabled,
}: CreateItemBasicInfoSectionProps) {
  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="create-item-sku" className="label-caps text-foreground">
          SKU
        </Label>
        <Input
          id="create-item-sku"
          placeholder="e.g. SL-1234-A"
          className="h-11 rounded-[10px] px-4"
          aria-invalid={Boolean(errors.sku)}
          disabled={disabled}
          {...register("sku")}
        />
        {errors.sku ? (
          <p className="text-xs text-destructive">{errors.sku.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="create-item-name" className="label-caps text-foreground">
          Name
        </Label>
        <Input
          id="create-item-name"
          placeholder="Item name"
          className="h-11 rounded-[10px] px-4"
          aria-invalid={Boolean(errors.name)}
          disabled={disabled}
          {...register("name")}
        />
        {errors.name ? (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="create-item-description"
          className="label-caps text-foreground"
        >
          Description
        </Label>
        <textarea
          id="create-item-description"
          rows={3}
          placeholder="Brief description of the item"
          className="w-full resize-none rounded-[10px] border border-input bg-transparent px-4 py-2 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
          aria-invalid={Boolean(errors.description)}
          disabled={disabled}
          {...register("description")}
        />
        {errors.description ? (
          <p className="text-xs text-destructive">
            {errors.description.message}
          </p>
        ) : null}
      </div>
    </section>
  );
}

