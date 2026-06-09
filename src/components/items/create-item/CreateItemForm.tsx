"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { z } from "zod";

import { useCategoriesList } from "@/hooks/useCategories";
import { useCreateItem } from "@/hooks/useItems";
import { useVendorsList } from "@/hooks/useVendors";
import { getApiErrorMessage } from "@/lib/api-errors";
import { useToast } from "@/providers/ToastProvider";

import CreateItemBasicInfoSection, {
  type CreateItemFormValues,
} from "./CreateItemBasicInfoSection";
import CreateItemStockPricingSection from "./CreateItemStockPricingSection";
import CreateItemLogisticsSection from "./CreateItemLogisticsSection";

const createItemSchema = z.object({
  sku: z.string().min(1, { message: "SKU is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional().default(""),
  initial_stock: z.coerce
    .number()
    .int({ message: "Initial stock must be a whole number" })
    .min(0, { message: "Initial stock cannot be negative" }),
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

type CreateItemFormProps = {
  formId: string;
  onCreated: () => void;
  onSubmittingChange: (value: boolean) => void;
};

export default function CreateItemForm({
  formId,
  onCreated,
  onSubmittingChange,
}: CreateItemFormProps) {
  const { toast } = useToast();
  const createItemMutation = useCreateItem();
  const categoriesQuery = useCategoriesList();
  const vendorsQuery = useVendorsList({
    page: 1,
    limit: 250,
    sort_by: "name",
    sort_dir: "asc",
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateItemFormValues>({
    resolver: standardSchemaResolver(createItemSchema),
    defaultValues: {
      sku: "",
      name: "",
      description: "",
      initial_stock: 0,
      minimum_stock_level: 0,
      cost_price: 0,
      selling_price: 0,
      category_id: "",
      vendor_id: "",
      bin_location: "",
    },
  });

  useEffect(() => {
    onSubmittingChange(createItemMutation.isPending);
  }, [createItemMutation.isPending, onSubmittingChange]);

  async function onSubmit(values: CreateItemFormValues) {
    const sku = values.sku.trim();
    const name = values.name.trim();
    const description = values.description?.trim() ?? "";
    const binLocation = values.bin_location.trim();

    setValue("sku", sku, { shouldDirty: true, shouldValidate: true });
    setValue("name", name, { shouldDirty: true, shouldValidate: true });
    setValue("description", description, { shouldDirty: true });
    setValue("bin_location", binLocation, {
      shouldDirty: true,
      shouldValidate: true,
    });

    try {
      await createItemMutation.mutateAsync({
        sku,
        name,
        description,
        initial_stock: values.initial_stock,
        minimum_stock_level: values.minimum_stock_level,
        cost_price: values.cost_price,
        selling_price: values.selling_price,
        category_id: values.category_id,
        vendor_id: values.vendor_id,
        bin_location: binLocation,
      });

      toast({
        title: "Item created",
        description: `"${name}" is now available in inventory.`,
        variant: "success",
      });
      onCreated();
    } catch (error) {
      toast({
        title: "Failed to create item",
        description: getApiErrorMessage(error, "Please try again."),
        variant: "error",
      });
    }
  }

  const isSubmitting = createItemMutation.isPending;

  const categories = categoriesQuery.data ?? [];
  const vendors = vendorsQuery.data?.data ?? [];

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(onSubmit)}
      className="flex-1 overflow-y-auto px-6 py-6"
    >
      <div className="space-y-6">
        <CreateItemBasicInfoSection
          register={register}
          errors={errors}
          disabled={isSubmitting}
        />

        <CreateItemStockPricingSection
          register={register}
          errors={errors}
          disabled={isSubmitting}
        />

        <CreateItemLogisticsSection
          register={register}
          errors={errors}
          disabled={isSubmitting}
          categories={categories}
          vendors={vendors}
          isLoadingCategories={categoriesQuery.isLoading}
          isLoadingVendors={vendorsQuery.isLoading}
        />

        {createItemMutation.isError ? (
          <p className="text-sm text-destructive">
            {getApiErrorMessage(
              createItemMutation.error,
              "Failed to create item",
            )}
          </p>
        ) : null}
      </div>
    </form>
  );
}
