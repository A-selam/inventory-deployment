"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";

import Label from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Combobox from "@/components/ui/combobox/Combobox";
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
  values: Pick<CreateItemFormValues, "category_id" | "vendor_id" | "warehouse_id">;
  onCategoryChange: (next: string) => void;
  onVendorChange: (next: string) => void;
  onWarehouseChange: (next: string) => void;
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
  values,
  onCategoryChange,
  onVendorChange,
  onWarehouseChange,
}: CreateItemLogisticsSectionProps) {
  const selectClassName =
    "h-9 w-full appearance-none rounded-md border border-input bg-transparent px-3 pr-9 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40";

  return (
    <section className="space-y-3">
      <div className="space-y-1.5">
        <Combobox
          label="Category"
          value={values.category_id}
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
          placeholder={isLoadingCategories ? "Loading categories…" : "Search categories"}
          disabled={disabled || isLoadingCategories}
          loading={isLoadingCategories}
          error={errors.category_id?.message}
          onChange={onCategoryChange}
        />
      </div>

      <div className="space-y-1.5">
        <Combobox
          label="Vendor"
          value={values.vendor_id}
          options={vendors.map((v) => ({ value: v.id, label: v.name }))}
          placeholder={isLoadingVendors ? "Loading vendors…" : "Search vendors"}
          disabled={disabled || isLoadingVendors}
          loading={isLoadingVendors}
          error={errors.vendor_id?.message}
          onChange={onVendorChange}
        />
      </div>

      <div className="space-y-1.5">
        <Combobox
          label="Warehouse"
          value={values.warehouse_id}
          options={warehouses.map((w) => ({ value: w.id, label: w.name }))}
          placeholder={isLoadingWarehouses ? "Loading warehouses…" : "Search warehouses"}
          disabled={disabled || isLoadingWarehouses}
          loading={isLoadingWarehouses}
          error={errors.warehouse_id?.message}
          onChange={onWarehouseChange}
        />
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
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">▼</span>
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


