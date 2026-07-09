"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import type { CreateVendorFormValues } from "./CreateVendorForm";

type CreateVendorContactSectionProps = {
  register: UseFormRegister<CreateVendorFormValues>;
  errors: FieldErrors<CreateVendorFormValues>;
  disabled: boolean;
};

export default function CreateVendorContactSection({
  register,
  errors,
  disabled,
}: CreateVendorContactSectionProps) {
  return (
    <section className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
      <div className="space-y-2">
        <Label
          htmlFor="create-vendor-contact-first-name"
          className="label-caps text-foreground"
        >
          First Name
        </Label>
        <Input
          id="create-vendor-contact-first-name"
          {...register("contact_person.first_name")}
          placeholder="e.g. Chen"
          aria-invalid={Boolean(errors.contact_person?.first_name)}
          disabled={disabled}
          className="h-11 rounded-[10px] px-4"
        />
        {errors.contact_person?.first_name && (
          <p className="text-xs text-destructive">
            {errors.contact_person.first_name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="create-vendor-contact-last-name"
          className="label-caps text-foreground"
        >
          Last Name
        </Label>
        <Input
          id="create-vendor-contact-last-name"
          {...register("contact_person.last_name")}
          placeholder="e.g. Wei"
          aria-invalid={Boolean(errors.contact_person?.last_name)}
          disabled={disabled}
          className="h-11 rounded-[10px] px-4"
        />
        {errors.contact_person?.last_name && (
          <p className="text-xs text-destructive">
            {errors.contact_person.last_name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="create-vendor-contact-email"
          className="label-caps text-foreground"
        >
          Email Address
        </Label>
        <Input
          id="create-vendor-contact-email"
          type="email"
          {...register("contact_info.email")}
          placeholder="e.g. chen.wei@lumina.com"
          aria-invalid={Boolean(errors.contact_info?.email)}
          disabled={disabled}
          className="h-11 rounded-[10px] px-4"
        />
        {errors.contact_info?.email && (
          <p className="text-xs text-destructive">
            {errors.contact_info.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="create-vendor-contact-primary-phone"
          className="label-caps text-foreground"
        >
          Primary Phone
        </Label>
        <Input
          id="create-vendor-contact-primary-phone"
          {...register("contact_info.primary_phone")}
          placeholder="e.g. +86 123 4567 890"
          aria-invalid={Boolean(errors.contact_info?.primary_phone)}
          disabled={disabled}
          className="h-11 rounded-[10px] px-4"
        />
        {errors.contact_info?.primary_phone && (
          <p className="text-xs text-destructive">
            {errors.contact_info.primary_phone.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="create-vendor-contact-secondary-phone"
          className="label-caps text-foreground"
        >
          Secondary Phone
        </Label>
        <Input
          id="create-vendor-contact-secondary-phone"
          {...register("contact_info.secondary_phone")}
          placeholder="Optional"
          aria-invalid={Boolean(errors.contact_info?.secondary_phone)}
          disabled={disabled}
          className="h-11 rounded-[10px] px-4"
        />
        {errors.contact_info?.secondary_phone && (
          <p className="text-xs text-destructive">
            {errors.contact_info.secondary_phone.message}
          </p>
        )}
      </div>
    </section>
  );
}
