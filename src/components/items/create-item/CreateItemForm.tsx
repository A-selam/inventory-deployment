"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

import { useCategoriesList } from "@/hooks/useCategories";
import { useCreateItem } from "@/hooks/useItems";
import { useVendorsList } from "@/hooks/useVendors";
import { useWarehousesList } from "@/hooks/useWarehouses";
import { getApiErrorMessage } from "@/lib/api-errors";
import { checkSkuAvailability } from "@/lib/items";
import { useToast } from "@/providers/ToastProvider";

import CreateItemBasicInfoSection, {
  type CreateItemFormValues,
} from "./CreateItemBasicInfoSection";
import CreateItemStockPricingSection from "./CreateItemStockPricingSection";
import CreateItemLogisticsSection from "./CreateItemLogisticsSection";

const skuFormatRegex = /^SKU-\d+$/;

const createItemSchema = z.object({
  sku: z
    .string()
    .min(1, { message: "SKU is required" })
    .regex(skuFormatRegex, { message: "SKU must be in the format SKU-001" }),
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
  warehouse_id: z.string().min(1, { message: "Warehouse is required" }),
  bin_location: z.string().min(1, { message: "Bin location is required" }),
  Itemtypes: z.string().min(1, { message: "Item type is required" }),
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
  const warehousesQuery = useWarehousesList({ page: 1, limit: 250 });
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
    setError,
    clearErrors,
    trigger,
    watch,
    formState: { errors },
  } = useForm<CreateItemFormValues>({

    resolver: standardSchemaResolver(createItemSchema) as never,
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
      warehouse_id: "",
      bin_location: "",
      Itemtypes: "SALLABLE",
    },
  });

  const [skuToCheck, setSkuToCheck] = useState<string | null>(null);
  const [skuInput, setSkuInput] = useState("");
  const normalizedSku = skuInput.trim().toUpperCase();

  const skuCheckQuery = useQuery({
    queryKey: ["items", "check-sku", skuToCheck ?? ""] as const,
    queryFn: () => checkSkuAvailability(skuToCheck as string),
    enabled: Boolean(skuToCheck),
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    onSubmittingChange(createItemMutation.isPending);
  }, [createItemMutation.isPending, onSubmittingChange]);

  useEffect(() => {
    if (!skuToCheck) return;
    if (!skuCheckQuery.data) return;
    if (skuCheckQuery.data.sku !== skuToCheck) return;

    if (!skuCheckQuery.data.available) {
      setError("sku", {
        type: "validate",
        message: skuCheckQuery.data.message,
      });
      return;
    }

    clearErrors("sku");
  }, [clearErrors, setError, skuCheckQuery.data, skuToCheck]);

  async function onSubmit(values: CreateItemFormValues) {
    const sku = values.sku.trim().toUpperCase();
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

    // Clear any previous backend field errors before trying again.
    clearErrors(["vendor_id", "warehouse_id", "category_id"] as const);


    if (!skuFormatRegex.test(sku)) {
      setError("sku", {
        type: "validate",
        message: "SKU must be in the format SKU-001",
      });
      return;
    }

    try {
      const skuCheckResult =
        skuToCheck === sku &&
        skuCheckQuery.data &&
        skuCheckQuery.data.sku === sku
          ? skuCheckQuery.data
          : await checkSkuAvailability(sku);

      if (!skuCheckResult.available) {
        setError("sku", { type: "validate", message: skuCheckResult.message });
        return;
      }
    } catch (error) {
      setError("sku", {
        type: "validate",
        message: getApiErrorMessage(error, "Could not validate SKU."),
      });
      return;
    }

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
        warehouse_id: values.warehouse_id,
        bin_location: binLocation,
        Itemtypes: values.Itemtypes,
      });

      toast({
        title: "Item created",
        description: `"${name}" is now available in inventory.`,
        variant: "success",
      });
      onCreated();
    } catch (error) {
      const payload = (() => {
        try {
          if (typeof error === "object" && error && "response" in error) {
            const anyErr = error as { response?: { data?: unknown } };
            return anyErr.response?.data;
          }
        } catch {
          // ignore
        }
        return undefined;
      })();

      // Best-effort mapping of backend field errors into react-hook-form.
      // Supports common shapes like: { detail: { errors: { field: ['msg'] | 'msg' } } }
      const fieldErrors = (() => {
        if (!payload || typeof payload !== "object") return undefined;
        const p = payload as Record<string, unknown>;
        const detail = p.detail as unknown;
        if (detail && typeof detail === "object") {
          const d = detail as Record<string, unknown>;
          const errors = d.errors as unknown;
          return errors;
        }
        return undefined;
      })();

      if (fieldErrors && typeof fieldErrors === "object") {
        const fe = fieldErrors as Record<string, unknown>;
        const toMessage = (v: unknown): string | undefined => {
          if (typeof v === "string") return v;
          if (Array.isArray(v) && v.length > 0 && typeof v[0] === "string") {
            return v[0] as string;
          }
          return undefined;
        };

        const categoryMsg = toMessage(fe.category_id);
        if (categoryMsg) setError("category_id", { type: "validate", message: categoryMsg });

        const vendorMsg = toMessage(fe.vendor_id);
        if (vendorMsg) setError("vendor_id", { type: "validate", message: vendorMsg });

        const warehouseMsg = toMessage(fe.warehouse_id);
        if (warehouseMsg) {
          setError("warehouse_id", {
            type: "validate",
            message: warehouseMsg,
          });
        }
      }

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
  const warehouses = warehousesQuery.data?.data.data ?? [];

  const skuStatusMessage = (() => {
    if (!normalizedSku) return undefined;
    if (!skuFormatRegex.test(normalizedSku)) return "Format: SKU-001";
    if (skuToCheck !== normalizedSku) return undefined;
    if (skuCheckQuery.isFetching) return "Checking availability…";
    if (skuCheckQuery.isError) return "Could not validate SKU right now.";
    if (!skuCheckQuery.data) return undefined;
    return skuCheckQuery.data.message;
  })();

  const skuStatusTone = (() => {
    if (!normalizedSku) return "muted" as const;
    if (!skuFormatRegex.test(normalizedSku)) return "muted" as const;
    if (skuToCheck !== normalizedSku) return "muted" as const;
    if (skuCheckQuery.isError) return "error" as const;
    if (!skuCheckQuery.data) return "muted" as const;
    return skuCheckQuery.data.available
      ? ("success" as const)
      : ("error" as const);
  })();

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(onSubmit)}
      className="flex-1 overflow-y-auto px-5 py-5"
    >
      <div className="space-y-5">
        <CreateItemBasicInfoSection
          register={register}
          skuField={register("sku", {
            onChange: (event) => {
              setSkuToCheck(null);
              setSkuInput(String(event.target.value ?? ""));
            },
            onBlur: async (event) => {
              const value = String(event.target.value ?? "");
              const nextSku = value.trim().toUpperCase();
              setSkuInput(nextSku);
              setValue("sku", nextSku, {
                shouldDirty: true,
                shouldValidate: true,
              });
              await trigger("sku");
              setSkuToCheck(skuFormatRegex.test(nextSku) ? nextSku : null);
            },
          })}
          errors={errors}
          disabled={isSubmitting}
          skuStatusMessage={skuStatusMessage}
          skuStatusTone={skuStatusTone}
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
          warehouses={warehouses}
          isLoadingCategories={categoriesQuery.isLoading}
          isLoadingVendors={vendorsQuery.isLoading}
          isLoadingWarehouses={warehousesQuery.isLoading}
          values={{
            category_id: watch("category_id"),
            vendor_id: watch("vendor_id"),
            warehouse_id: watch("warehouse_id"),
          }}
          onCategoryChange={(next) => {
            setValue("category_id", next, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }}
          onVendorChange={(next) => {
            setValue("vendor_id", next, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }}
          onWarehouseChange={(next) => {
            setValue("warehouse_id", next, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }}
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
