"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { z } from "zod";

import { useCreateVendor } from "@/hooks/useVendors";
import { getApiErrorMessage } from "@/lib/api-errors";
import { useToast } from "@/providers/ToastProvider";

import CreateVendorBasicInfoSection from "./CreateVendorBasicInfoSection";
import CreateVendorContactSection from "./CreateVendorContactSection";
import CreateVendorLocationSection from "./CreateVendorLocationSection";

const createVendorSchema = z.object({
  name: z.string().min(1, { message: "Vendor name is required" }),
  contact_person: z.object({
    first_name: z.string().min(1, { message: "First name is required" }),
    last_name: z.string().min(1, { message: "Last name is required" }),
  }),
  contact_info: z.object({
    primary_phone: z.string().min(1, { message: "Primary phone is required" }),
    secondary_phone: z.string().optional().default(""),
    email: z.string().email({ message: "Invalid email address" }),
  }),
  location: z.object({
    city: z.string().min(1, { message: "City is required" }),
    country: z.string().min(1, { message: "Country is required" }),
  }),
  lead_time: z.coerce
    .number()
    .int({ message: "Lead time must be a whole number" })
    .min(0, { message: "Lead time cannot be negative" }),
});

export type CreateVendorFormValues = z.infer<typeof createVendorSchema>;

type CreateVendorFormProps = {
  formId: string;
  onCreated: () => void;
  onSubmittingChange: (value: boolean) => void;
};

export default function CreateVendorForm({
  formId,
  onCreated,
  onSubmittingChange,
}: CreateVendorFormProps) {
  const { toast } = useToast();
  const createVendorMutation = useCreateVendor();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateVendorFormValues>({
    resolver: standardSchemaResolver(createVendorSchema),
    defaultValues: {
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
    },
  });

  useEffect(() => {
    onSubmittingChange(createVendorMutation.isPending);
  }, [createVendorMutation.isPending, onSubmittingChange]);

  async function onSubmit(values: CreateVendorFormValues) {
    try {
      await createVendorMutation.mutateAsync({
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
      });

      toast({
        title: "Vendor created",
        description: `${values.name} has been successfully added to the network.`,
        variant: "success",
      });

      onCreated();
    } catch (error) {
      toast({
        title: "Failed to create vendor",
        description: getApiErrorMessage(error),
        variant: "error",
      });
    }
  }

  const isSubmitting = createVendorMutation.isPending;

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(onSubmit)}
      className="flex-1 overflow-y-auto px-6 py-6"
    >
      <div className="space-y-6">
        <section className="space-y-4">
          <h4 className="text-sm font-semibold text-foreground">
            Basic Information
          </h4>
          <CreateVendorBasicInfoSection
            register={register}
            errors={errors}
            disabled={isSubmitting}
          />
        </section>

        <section className="space-y-4">
          <h4 className="text-sm font-semibold text-foreground">
            Contact Details
          </h4>
          <CreateVendorContactSection
            register={register}
            errors={errors}
            disabled={isSubmitting}
          />
        </section>

        <section className="space-y-4">
          <h4 className="text-sm font-semibold text-foreground">Location</h4>
          <CreateVendorLocationSection
            register={register}
            errors={errors}
            disabled={isSubmitting}
          />
        </section>

        {createVendorMutation.isError ? (
          <p className="text-sm text-destructive">
            {getApiErrorMessage(
              createVendorMutation.error,
              "Failed to create vendor",
            )}
          </p>
        ) : null}
      </div>
    </form>
  );
}
