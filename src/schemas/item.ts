import { z } from "zod";
import { sanitizeInput, sanitizeIdentifier } from "@/lib/sanitize";
import {
  sanitizedString,
  sanitizedStringOptional,
  sanitizedIdentifier as createSanitizedIdentifier,
} from "./sanitized";

export const skuFormatRegex = /^SKU-\d+$/;

export const createItemSchema = z.object({
  sku: z
    .string()
    .min(1, { message: "SKU is required" })
    .max(20, { message: "SKU cannot exceed 20 characters" })
    .regex(skuFormatRegex, { message: "SKU must be in the format SKU-001" })
    .transform((val) => sanitizeIdentifier(val)),
  name: sanitizedString({
    min: 3,
    max: 50,
    message: "Name is required",
  }),
  description: sanitizedStringOptional({
    max: 200,
  }),
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
  bin_location: sanitizedString({
    min: 1,
    max: 50,
    message: "Bin location is required",
  }),
  Itemtypes: z.string().min(1, { message: "Item type is required" }),
});

export const updateItemSchema = z.object({
  name: sanitizedString({
    min: 3,
    max: 50,
    message: "Name is required",
  }),
  description: sanitizedStringOptional({
    max: 200,
  }),
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
  bin_location: sanitizedString({
    min: 1,
    max: 50,
    message: "Bin location is required",
  }),
});
