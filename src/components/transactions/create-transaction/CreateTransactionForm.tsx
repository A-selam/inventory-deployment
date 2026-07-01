"use client";

import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Loader2 } from "lucide-react";
import { z } from "zod";

import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useCreateTransaction } from "@/hooks/useTransactions";
import { useToast } from "@/providers/ToastProvider";
import { getApiErrorMessage } from "@/lib/api-errors";
import TransactionSummaryCard from "@/components/transactions/create-transaction/TransactionSummaryCard";

type CreateTransactionFormProps = {
  itemId: string;
  itemName: string;
  currentStock: number;
};

const createTransactionSchema = z.object({
  transactionType: z.enum(["inbound", "outbound"]),
  quantity: z.coerce
    .number()
    .int({ message: "Quantity must be a whole number" })
    .min(1, { message: "Quantity must be greater than 0" }),
});

type CreateTransactionValues = z.infer<typeof createTransactionSchema>;

const controlClassName =
  "h-11 w-full rounded-xl border border-input bg-transparent px-4 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40";

export default function CreateTransactionForm({
  itemId,
  itemName,
  currentStock,
}: CreateTransactionFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const createTransactionMutation = useCreateTransaction();

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateTransactionValues>({
    resolver: standardSchemaResolver(createTransactionSchema) as never,
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      transactionType: "inbound",
      quantity: 1,
    },
  });

  const transactionType = useWatch({
    control,
    name: "transactionType",
    defaultValue: "inbound",
  });
  const quantity = useWatch({ control, name: "quantity", defaultValue: 1 });

  const safeQuantity =
    typeof quantity === "number" && Number.isFinite(quantity)
      ? Math.max(0, quantity)
      : 0;
  const isQuantityValid = safeQuantity >= 1;
  const netChange =
    transactionType === "outbound" ? -Math.abs(safeQuantity) : safeQuantity;
  const newBalance = currentStock + netChange;
  const invalidOutbound = transactionType === "outbound" && newBalance < 0;
  const isFormInvalid = !isQuantityValid || invalidOutbound;

  async function onSubmit(values: CreateTransactionValues) {
    const safeQuantity = Math.abs(values.quantity);

    if (safeQuantity < 1) {
      setError("quantity", {
        type: "validate",
        message: "Quantity must be greater than 0.",
      });
      return;
    }

    if (values.transactionType === "outbound" && safeQuantity > currentStock) {
      setError("quantity", {
        type: "validate",
        message: `Outbound quantity cannot exceed current stock (${currentStock}).`,
      });
      toast({
        title: "Invalid outbound transaction",
        description: "This transaction would make stock go below 0.",
        variant: "error",
      });
      return;
    }

    const quantityChange =
      values.transactionType === "outbound" ? safeQuantity : safeQuantity;

    try {
      await createTransactionMutation.mutateAsync({
        item_id: itemId,
        transaction_type: values.transactionType,
        quantity_change: quantityChange,
      });

      toast({
        title: "Transaction created",
        description: `Stock updated for "${itemName}".`,
        variant: "success",
      });
      router.push(`/inventory/${itemId}`);
      router.refresh();
    } catch (error) {
      toast({
        title: "Failed to create transaction",
        description: getApiErrorMessage(error, "Please try again."),
        variant: "error",
      });
    }
  }

  const isSubmitting = createTransactionMutation.isPending;
  const submitDisabled = isSubmitting || isFormInvalid;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label
            htmlFor="transaction-type"
            className="label-caps text-foreground"
          >
            Transaction Type
          </Label>
          <select
            id="transaction-type"
            className={cn(controlClassName, "bg-card")}
            aria-invalid={Boolean(errors.transactionType)}
            disabled={isSubmitting}
            {...register("transactionType")}
          >
            <option value="inbound">Inbound (Stock In)</option>
            <option value="outbound">Outbound (Stock Out)</option>
          </select>
          {errors.transactionType ? (
            <p className="text-xs text-destructive">
              {errors.transactionType.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="item-reference"
            className="label-caps text-foreground"
          >
            Item Reference
          </Label>
          <div
            className={cn(
              controlClassName,
              "flex items-center bg-muted/30 text-foreground",
            )}
          >
            <span className="truncate font-semibold">{itemName}</span>
            <span className="ml-3 text-xs text-muted-foreground">{itemId}</span>
          </div>
        </div>

        <div className="space-y-2 md:col-span-1">
          <Label htmlFor="quantity" className="label-caps text-foreground">
            Quantity
          </Label>
          <div className="relative">
            <Input
              id="quantity"
              type="number"
              inputMode="numeric"
              min={1}
              step={1}
              className="h-11 rounded-xl px-4"
              aria-invalid={Boolean(errors.quantity)}
              disabled={isSubmitting}
              {...register("quantity", { valueAsNumber: true })}
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              units
            </span>
          </div>
          {errors.quantity ? (
            <p className="text-xs text-destructive">
              {errors.quantity.message}
            </p>
          ) : null}
          {invalidOutbound ? (
            <p className="text-xs text-destructive">
              Outbound transactions cannot reduce stock below 0.
            </p>
          ) : null}
          {!errors.quantity && !isQuantityValid ? (
            <p className="text-xs text-destructive">
              Quantity must be greater than 0.
            </p>
          ) : null}
        </div>
      </div>

      <TransactionSummaryCard
        currentStock={currentStock}
        netChange={netChange}
        newBalance={newBalance}
        status={isFormInvalid ? "invalid" : "ready"}
      />

      <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          className="h-11 rounded-xl px-5"
          onClick={() => router.push(`/inventory/${itemId}`)}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="h-11 rounded-xl px-5"
          disabled={submitDisabled}
        >
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin mr-2" />
          ) : null}
          <span>Submit Transaction</span>
        </Button>
      </div>
    </form>
  );
}
