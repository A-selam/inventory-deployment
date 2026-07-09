"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { z } from "zod";

import { useCreateVendor, useUpdateVendor } from "@/hooks/useVendors";
import { getApiErrorMessage } from "@/lib/api-errors";
import type { Vendor } from "@/lib/vendors";
import { useToast } from "@/providers/ToastProvider";

import { parseVendorContactInfo } from "../vendor-utils";
import CreateVendorBasicInfoSection from "./CreateVendorBasicInfoSection";
import CreateVendorContactSection from "./CreateVendorContactSection";
import CreateVendorLocationSection from "./CreateVendorLocationSection";
import { createVendorSchema } from "@/schemas/vendor";

export type CreateVendorFormValues = z.infer<typeof createVendorSchema>;

const emptyFormValues: CreateVendorFormValues = {
  name: "",
  contact_person: {
    first_name: "",
    last_name: "",
  },
  contact_info: {
    primary_phone: "",
    secondary_phone: "",
    email: "",
  },
  location: {
    city: "",
    country: "",
  },
  lead_time: 0,
};

function splitLocation(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return { city: "", country: "" };

  const parts = trimmed
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 1) return { city: parts[0] ?? "", country: "" };
  return { city: parts[0] ?? "", country: parts.slice(1).join(", ") };
}

function splitContactPerson(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return { first_name: "", last_name: "" };
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return { first_name: parts[0] ?? "", last_name: "" };
  return { first_name: parts[0] ?? "", last_name: parts.slice(1).join(" ") };
}

function toFormValues(vendor: Vendor): CreateVendorFormValues {
  const contactInfo = parseVendorContactInfo(vendor.contact_info);
  const contactPerson =
    typeof vendor.contact_person === "string"
      ? splitContactPerson(vendor.contact_person)
      : vendor.contact_person;

  const location =
    typeof vendor.location === "string"
      ? splitLocation(vendor.location)
      : vendor.location;

  return {
    name: vendor.name ?? "",
    contact_person: {
      first_name: contactPerson.first_name ?? "",
      last_name: contactPerson.last_name ?? "",
    },
    contact_info: {
      primary_phone: contactInfo.phone ?? "",
      secondary_phone: contactInfo.secondaryPhone ?? "",
      email: contactInfo.email ?? "",
    },
    location: {
      city: location.city ?? "",
      country: location.country ?? "",
    },
    lead_time: vendor.lead_time ?? 0,
  };
}

type CreateVendorFormProps = {
  formId: string;
  mode?: "create" | "edit";
  vendor?: Vendor;
  onSuccess: () => void;
  onSubmittingChange: (value: boolean) => void;
};

export default function CreateVendorForm({
  formId,
  mode = "create",
  vendor,
  onSuccess,
  onSubmittingChange,
}: CreateVendorFormProps) {
  const { toast } = useToast();
  const createVendorMutation = useCreateVendor();
  const updateVendorMutation = useUpdateVendor(
    mode === "edit" ? vendor?.id : undefined,
  );
  const isEdit = mode === "edit";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateVendorFormValues>({
    resolver: standardSchemaResolver(createVendorSchema) as never,
    defaultValues: emptyFormValues,
  });

  useEffect(() => {
    onSubmittingChange(
      isEdit ? updateVendorMutation.isPending : createVendorMutation.isPending,
    );
  }, [
    createVendorMutation.isPending,
    isEdit,
    onSubmittingChange,
    updateVendorMutation.isPending,
  ]);

  useEffect(() => {
    if (isEdit && vendor) {
      reset(toFormValues(vendor));
      return;
    }

    reset(emptyFormValues);
  }, [isEdit, reset, vendor]);

  async function onSubmit(values: CreateVendorFormValues) {
    try {
      const payload = {
        ...values,
        name: values.name.trim(),
        contact_person: {
          first_name: values.contact_person.first_name.trim(),
          last_name: values.contact_person.last_name.trim(),
        },
        contact_info: {
          ...values.contact_info,
          primary_phone: values.contact_info.primary_phone.trim(),
          secondary_phone: values.contact_info.secondary_phone?.trim() ?? "",
          email: values.contact_info.email.trim(),
        },
        location: {
          city: values.location.city.trim(),
          country: values.location.country.trim(),
        },
      };

      if (isEdit) {
        if (!vendor?.id) {
          throw new Error("Missing vendor id");
        }

        await updateVendorMutation.mutateAsync(payload);

        toast({
          title: "Supplier updated",
          description: `${values.name} has been successfully updated.`,
          variant: "success",
        });
      } else {
        await createVendorMutation.mutateAsync(payload);

        toast({
          title: "Supplier created",
          description: `${values.name} has been successfully added to the network.`,
          variant: "success",
        });
      }

      onSuccess();
    } catch (error) {
      toast({
        title: isEdit
          ? "Failed to update supplier"
          : "Failed to create supplier",
        description: getApiErrorMessage(error),
        variant: "error",
      });
    }
  }

  const activeMutation = isEdit ? updateVendorMutation : createVendorMutation;
  const isSubmitting = activeMutation.isPending;

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(onSubmit)}
      className="flex-1 overflow-y-auto px-6 py-6"
    >
      <div className="space-y-6">
        <section className="space-y-1">
          <h4 className="text-sm font-semibold text-foreground">
            Basic Information
          </h4>
          <CreateVendorBasicInfoSection
            register={register}
            errors={errors}
            disabled={isSubmitting}
          />
        </section>

        <section className="space-y-1">
          <h4 className="text-sm font-semibold text-foreground">
            Contact Details
          </h4>
          <CreateVendorContactSection
            register={register}
            errors={errors}
            disabled={isSubmitting}
          />
        </section>

        <section className="space-y-1">
          <h4 className="text-sm font-semibold text-foreground">Location</h4>
          <CreateVendorLocationSection
            register={register}
            errors={errors}
            disabled={isSubmitting}
          />
        </section>

        {activeMutation.isError ? (
          <p className="text-sm text-destructive">
            {getApiErrorMessage(
              activeMutation.error,
              isEdit
                ? "Failed to update supplier"
                : "Failed to create supplier",
            )}
          </p>
        ) : null}
      </div>
    </form>
  );
}
