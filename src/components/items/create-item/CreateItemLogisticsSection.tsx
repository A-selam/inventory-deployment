"use client";

import { ChevronDown } from "lucide-react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

import Label from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { Category } from "@/lib/categories";
import type { Vendor } from "@/lib/vendors";
import type { Warehouse } from "@/lib/warehouses";
import type { CreateItemFormValues } from "./CreateItemBasicInfoSection";

type CreateItemLogisticsSectionProps = {
  register: UseFormRegister<CreateItemFormValues>;
  errors: FieldErrors<CreateItemFormValues>;
  disabled: boolean;
  categories: Category[];
  vendors: Vendor[];
  warehouses: Warehouse[];
  isLoadingCategories: boolean;
  isLoadingVendors: boolean;
  isLoadingWarehouses: boolean;
};

export default function CreateItemLogisticsSection({
  register,
  errors,
  disabled,
  categories,
  vendors,
  warehouses,
  isLoadingCategories,
  isLoadingVendors,
  isLoadingWarehouses,
}: CreateItemLogisticsSectionProps) {
  const selectClassName =
    "h-9 w-full appearance-none rounded-md border border-input bg-transparent px-3 pr-9 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40";

  return (
    <section className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
      <div className="space-y-1.5">
        <Label
          htmlFor="create-item-category"
          className="label-caps text-foreground"
        >
          Category
        </Label>
        <div className="relative">
          <select
            id="create-item-category"
            className={selectClassName}
            aria-invalid={Boolean(errors.category_id)}
            disabled={disabled || isLoadingCategories}
            {...register("category_id")}
          >
            <option value="">
              {isLoadingCategories ? "Loading categories…" : "Select category"}
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
        {errors.category_id ? (
          <p className="text-xs text-destructive">
            {errors.category_id.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label
          htmlFor="create-item-vendor"
          className="label-caps text-foreground"
        >
          Vendor
        </Label>
        <div className="relative">
          <select
            id="create-item-vendor"
            className={selectClassName}
            aria-invalid={Boolean(errors.vendor_id)}
            disabled={disabled || isLoadingVendors}
            {...register("vendor_id")}
          >
            <option value="">
              {isLoadingVendors ? "Loading vendors…" : "Select vendor"}
            </option>
            {vendors.map((vendor) => (
              <option key={vendor.id} value={vendor.id}>
                {vendor.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
        {errors.vendor_id ? (
          <p className="text-xs text-destructive">{errors.vendor_id.message}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label
          htmlFor="create-item-warehouse"
          className="label-caps text-foreground"
        >
          Warehouse
        </Label>
        <div className="relative">
          <select
            id="create-item-warehouse"
            className={selectClassName}
            aria-invalid={Boolean(errors.warehouse_id)}
            disabled={disabled || isLoadingWarehouses}
            {...register("warehouse_id")}
          >
            <option value="">
              {isLoadingWarehouses ? "Loading warehouses…" : "Select warehouse"}
            </option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
        {errors.warehouse_id ? (
          <p className="text-xs text-destructive">
            {errors.warehouse_id.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label
          htmlFor="create-item-item-type"
          className="label-caps text-foreground"
        >
          Item Type
        </Label>
        <div className="relative">
          <select
            id="create-item-item-type"
            className={selectClassName}
            aria-invalid={Boolean(errors.Itemtypes)}
            disabled={disabled}
            {...register("Itemtypes")}
          >
            <option value="SALLABLE">SALLABLE</option>
            <option value="NOT_SALLABLE">NOT SALLABLE</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
        {errors.Itemtypes ? (
          <p className="text-xs text-destructive">{errors.Itemtypes.message}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label
          htmlFor="create-item-bin-location"
          className="label-caps text-foreground"
        >
          Bin Location
        </Label>
        <Input
          id="create-item-bin-location"
          placeholder="e.g. A-12-04"
          className="h-9 rounded-md px-3"
          aria-invalid={Boolean(errors.bin_location)}
          disabled={disabled}
          {...register("bin_location")}
        />
        {errors.bin_location ? (
          <p className="text-xs text-destructive">
            {errors.bin_location.message}
          </p>
        ) : null}
      </div>
    </section>
  );
}
