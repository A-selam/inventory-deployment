"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import type { CreateVendorFormValues } from "./CreateVendorForm";

type CreateVendorBasicInfoSectionProps = {
  register: UseFormRegister<CreateVendorFormValues>;
  errors: FieldErrors<CreateVendorFormValues>;
  disabled: boolean;
};

export default function CreateVendorBasicInfoSection({
  register,
  errors,
  disabled,
}: CreateVendorBasicInfoSectionProps) {
  return (
    <section className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
      <div className="space-y-2">
        <Label
          htmlFor="create-vendor-name"
          className="label-caps text-foreground"
        >
          Supplier Name
        </Label>
        <Input
          id="create-vendor-name"
          {...register("name")}
          placeholder="e.g. Lumina Electronics"
          aria-invalid={Boolean(errors.name)}
          disabled={disabled}
          className="h-9 rounded-md px-3"
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="create-vendor-lead-time"
          className="label-caps text-foreground"
        >
          Lead Time (Days)
        </Label>
        <Input
          id="create-vendor-lead-time"
          type="number"
          {...register("lead_time")}
          placeholder="14"
          aria-invalid={Boolean(errors.lead_time)}
          disabled={disabled}
          className="h-9 rounded-md px-3"
        />
        {errors.lead_time && (
          <p className="text-xs text-destructive">{errors.lead_time.message}</p>
        )}
      </div>
    </section>
  );
}
