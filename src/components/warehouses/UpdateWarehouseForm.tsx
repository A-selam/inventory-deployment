"use client";

import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Loader2 } from "lucide-react";

import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import { useUpdateWarehouse } from "@/hooks/useWarehouses";
import { getApiErrorMessage } from "@/lib/api-errors";
import { useToast } from "@/providers/ToastProvider";

import { updateWarehouseSchema } from "@/schemas/warehouse";

type UpdateWarehouseValues = {
  name: string;
  location: string;
  capacity: number;
  description: string;
};

type UpdateWarehouseFormProps = {
  warehouseId: string;
  initialName: string;
  initialLocation: string | null;
  initialCapacity: number;
  initialDescription: string | null;
  onCancel: () => void;
  onUpdated: () => void;
};

export default function UpdateWarehouseForm({
  warehouseId,
  initialName,
  initialLocation,
  initialCapacity,
  initialDescription,
  onCancel,
  onUpdated,
}: UpdateWarehouseFormProps) {
  const { toast } = useToast();
  const updateWarehouseMutation = useUpdateWarehouse(warehouseId);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateWarehouseValues>({
    resolver: standardSchemaResolver(updateWarehouseSchema) as never,
    defaultValues: {
      name: initialName,
      location: initialLocation ?? "",
      capacity: initialCapacity,
      description: initialDescription ?? "",
    },
  });

  async function onSubmit(values: UpdateWarehouseValues) {
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
      await updateWarehouseMutation.mutateAsync({
        name,
        location: location ? location : null,
        capacity: values.capacity,
        description: description ? description : null,
      });
      toast({
        title: "Warehouse updated",
        description: `"${name}" was updated successfully.`,
        variant: "success",
      });
      onUpdated();
    } catch (error) {
      toast({
        title: "Failed to update warehouse",
        description: getApiErrorMessage(error, "Please try again."),
        variant: "error",
      });
    }
  }

  const isSubmitting = updateWarehouseMutation.isPending;

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
            placeholder="Warehouse name"
            className="h-11 rounded-xl px-4"
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
            placeholder="City / region"
            className="h-11 rounded-xl px-4"
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
            className="h-11 rounded-xl px-4"
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
          className="w-full resize-none rounded-[10px] border border-input bg-transparent px-4 py-2 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
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
          <span>Save changes</span>
        </Button>
      </div>

      {updateWarehouseMutation.isError ? (
        <p className="text-sm text-destructive">
          {getApiErrorMessage(
            updateWarehouseMutation.error,
            "Failed to update warehouse",
          )}
        </p>
      ) : null}
    </form>
  );
}
