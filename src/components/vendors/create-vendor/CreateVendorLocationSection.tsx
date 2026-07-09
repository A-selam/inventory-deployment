"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import type { CreateVendorFormValues } from "./CreateVendorForm";

type CreateVendorLocationSectionProps = {
  register: UseFormRegister<CreateVendorFormValues>;
  errors: FieldErrors<CreateVendorFormValues>;
  disabled: boolean;
};

export default function CreateVendorLocationSection({
  register,
  errors,
  disabled,
}: CreateVendorLocationSectionProps) {
  return (
    <section className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
      <div className="space-y-2">
        <Label
          htmlFor="create-vendor-city"
          className="label-caps text-foreground"
        >
          City
        </Label>
        <Input
          id="create-vendor-city"
          {...register("location.city")}
          placeholder="e.g. Shenzhen"
          aria-invalid={Boolean(errors.location?.city)}
          disabled={disabled}
          className="h-11 rounded-[10px] px-4"
        />
        {errors.location?.city && (
          <p className="text-xs text-destructive">
            {errors.location.city.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label
          htmlFor="create-vendor-country"
          className="label-caps text-foreground"
        >
          Country
        </Label>
        <Input
          id="create-vendor-country"
          {...register("location.country")}
          placeholder="e.g. China"
          aria-invalid={Boolean(errors.location?.country)}
          disabled={disabled}
          className="h-11 rounded-[10px] px-4"
        />
        {errors.location?.country && (
          <p className="text-xs text-destructive">
            {errors.location.country.message}
          </p>
        )}
      </div>
    </section>
  );
}
