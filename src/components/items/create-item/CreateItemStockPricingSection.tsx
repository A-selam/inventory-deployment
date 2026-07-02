"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import type { CreateItemFormValues } from "./CreateItemBasicInfoSection";

type CreateItemStockPricingSectionProps = {
  register: UseFormRegister<CreateItemFormValues>;
  errors: FieldErrors<CreateItemFormValues>;
  disabled: boolean;
};

function CurrencyInput({
  id,
  label,
  placeholder,
  error,
  disabled,
  registerProps,
}: {
  id: string;
  label: string;
  placeholder: string;
  error?: string;
  disabled: boolean;
  registerProps: ReturnType<UseFormRegister<CreateItemFormValues>>;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="label-caps text-foreground">
        {label}
      </Label>
      <div className="relative">
        <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          $
        </span>
        <Input
          id={id}
          type="number"
          step="0.01"
          min={0}
          placeholder={placeholder}
          className="h-9 rounded-md pl-6 pr-3"
          aria-invalid={Boolean(error)}
          disabled={disabled}
          {...registerProps}
        />
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

export default function CreateItemStockPricingSection({
  register,
  errors,
  disabled,
}: CreateItemStockPricingSectionProps) {
  return (
    <section className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label
            htmlFor="create-item-initial-stock"
            className="label-caps text-foreground"
          >
            Initial Stock
          </Label>
          <Input
            id="create-item-initial-stock"
            type="number"
            min={0}
            step="1"
            className="h-9 rounded-md px-3"
            aria-invalid={Boolean(errors.initial_stock)}
            disabled={disabled}
            {...register("initial_stock")}
          />
          {errors.initial_stock ? (
            <p className="text-xs text-destructive">
              {errors.initial_stock.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="create-item-min-stock"
            className="label-caps text-foreground"
          >
            Minimum Stock Level
          </Label>
          <Input
            id="create-item-min-stock"
            type="number"
            min={0}
            step="1"
            className="h-9 rounded-md px-3"
            aria-invalid={Boolean(errors.minimum_stock_level)}
            disabled={disabled}
            {...register("minimum_stock_level")}
          />
          {errors.minimum_stock_level ? (
            <p className="text-xs text-destructive">
              {errors.minimum_stock_level.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <CurrencyInput
          id="create-item-cost-price"
          label="Cost Price"
          placeholder="0.00"
          error={errors.cost_price?.message}
          disabled={disabled}
          registerProps={register("cost_price")}
        />

        <CurrencyInput
          id="create-item-selling-price"
          label="Selling Price"
          placeholder="0.00"
          error={errors.selling_price?.message}
          disabled={disabled}
          registerProps={register("selling_price")}
        />
      </div>
    </section>
  );
}

