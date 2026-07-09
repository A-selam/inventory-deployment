import { z } from "zod";

export const skuFormatRegex = /^SKU-\d+$/;

export const createItemSchema = z.object({
  sku: z
    .string()
    .min(1, { message: "SKU is required" })
    .max(20, { message: "SKU cannot exceed 20 characters" })
    .regex(skuFormatRegex, { message: "SKU must be in the format SKU-001" }),
  name: z
    .string()
    .min(3, { message: "Name is required" })
    .max(50, { message: "Name cannot exceed 50 characters" }),
  description: z
    .string()
    .max(200, { message: "Description cannot exceed 200 characters" })
    .optional()
    .default(""),
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

export const updateItemSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name is required" })
    .max(50, { message: "Name cannot exceed 50 characters" }),
  description: z
    .string()
    .max(200, { message: "Description cannot exceed 200 characters" })
    .optional()
    .default(""),
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
