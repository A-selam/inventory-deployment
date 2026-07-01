import z from "zod";

export const createWarehouseSchema = z.object({
  name: z.string().min(1, { message: "Warehouse name is required" }),
  location: z.string().optional(),
  capacity: z.coerce
    .number({ message: "Capacity must be a number" })
    .min(0, { message: "Capacity must be at least 0" }),
  description: z.string().optional(),
});

export const updateWarehouseSchema = z.object({
  name: z.string().min(1, { message: "Warehouse name is required" }),
  location: z.string().optional(),
  capacity: z.coerce
    .number({ message: "Capacity must be a number" })
    .min(0, { message: "Capacity must be at least 0" }),
  description: z.string().optional(),
});
