"use client";

import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Loader2 } from "lucide-react";

import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import { useCreateWarehouse } from "@/hooks/useWarehouses";
import { getApiErrorMessage } from "@/lib/api-errors";
import { useToast } from "@/providers/ToastProvider";

import { CreateWarehouseValues } from "@/types/warehouse";
import { createWarehouseSchema } from "@/schemas/warehouse";

type CreateWarehouseFormProps = {
  onCancel: () => void;
  onCreated: () => void;
};

export default function CreateWarehouseForm({
  onCancel,
  onCreated,
}: CreateWarehouseFormProps) {
  const { toast } = useToast();
  const createWarehouseMutation = useCreateWarehouse();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateWarehouseValues>({
    resolver: standardSchemaResolver(createWarehouseSchema) as never,
    defaultValues: {
      name: "",
      location: "",
      capacity: 0,
      description: "",
    },
  });

  async function onSubmit(values: CreateWarehouseValues) {
    const name = values.name.trim();
    if (!name) return;

    const location = values.location.trim();
    const description = values.description.trim();

    setValue("name", name, { shouldDirty: true, shouldValidate: true });
    setValue("location", location, { shouldDirty: true, shouldValidate: true });
    setValue("description", description, {
      shouldDirty: true,
      shouldValidate: true,
    });

    try {
      await createWarehouseMutation.mutateAsync({
        name,
        location: location ? location : null,
        capacity: values.capacity,
        description: description ? description : null,
      });
      toast({
        title: "Warehouse created",
        description: `"${name}" is ready for use.`,
        variant: "success",
      });
      onCreated();
    } catch (error) {
      toast({
        title: "Failed to create warehouse",
        description: getApiErrorMessage(error, "Please try again."),
        variant: "error",
      });
    }
  }

  const isSubmitting = createWarehouseMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label
            htmlFor="warehouse-name"
            className="label-caps text-foreground"
          >
            Name
          </Label>
          <Input
            id="warehouse-name"
            placeholder="e.g. Main Warehouse"
            className="h-9 rounded-md px-3"
            autoFocus
            aria-invalid={Boolean(errors.name)}
            disabled={isSubmitting}
            {...register("name")}
          />
          {errors.name ? (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="warehouse-location"
            className="label-caps text-foreground"
          >
            Location
          </Label>
          <Input
            id="warehouse-location"
            placeholder="e.g. Addis Ababa"
            className="h-9 rounded-md px-3"
            aria-invalid={Boolean(errors.location)}
            disabled={isSubmitting}
            {...register("location")}
          />
          {errors.location ? (
            <p className="text-xs text-destructive">
              {errors.location.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="warehouse-capacity"
            className="label-caps text-foreground"
          >
            Capacity
          </Label>
          <Input
            id="warehouse-capacity"
            type="number"
            min={0}
            step={1}
            className="h-9 rounded-md px-3"
            aria-invalid={Boolean(errors.capacity)}
            disabled={isSubmitting}
            {...register("capacity")}
          />
          {errors.capacity ? (
            <p className="text-xs text-destructive">
              {errors.capacity.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="warehouse-description"
          className="label-caps text-foreground"
        >
          Description
        </Label>
        <textarea
          id="warehouse-description"
          rows={3}
          placeholder="Add any notes about this location"
          className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
          aria-invalid={Boolean(errors.description)}
          disabled={isSubmitting}
          {...register("description")}
        />
        {errors.description ? (
          <p className="text-xs text-destructive">
            {errors.description.message}
          </p>
        ) : null}
      </div>

      <div className="flex justify-end gap-3 pt-1">
        <Button
          type="button"
          variant="outline"
          className="h-11 rounded-xl px-5"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="h-11 rounded-xl px-5"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
          <span>Create Warehouse</span>
        </Button>
      </div>

      {createWarehouseMutation.isError ? (
        <p className="text-sm text-destructive">
          {getApiErrorMessage(
            createWarehouseMutation.error,
            "Failed to create warehouse",
          )}
        </p>
      ) : null}
    </form>
  );
}
