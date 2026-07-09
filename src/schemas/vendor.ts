import { z } from "zod";

export const createVendorSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Supplier name must be at least 3 characters long" })
    .max(50, { message: "Supplier name cannot exceed 50 characters" }),
  contact_person: z.object({
    first_name: z
      .string()
      .min(3, { message: "First name must be at least 3 characters long" })
      .max(50, { message: "First name cannot exceed 50 characters" }),
    last_name: z
      .string()
      .min(3, { message: "Last name must be at least 3 characters long" })
      .max(50, { message: "Last name cannot exceed 50 characters" }),
  }),
  contact_info: z.object({
    primary_phone: z
      .string()
      .min(10, { message: "Primary phone must be at least 10 characters long" })
      .max(15, { message: "Primary phone cannot exceed 15 characters" }),
    secondary_phone: z.string().optional().default(""),
    email: z.string().email({ message: "Invalid email address" }),
  }),
  location: z.object({
    city: z
      .string()
      .min(4, { message: "City must be at least 4 characters long" })
      .max(50, { message: "City cannot exceed 50 characters" }),
    country: z
      .string()
      .min(4, { message: "Country must be at least 4 characters long" })
      .max(50, { message: "Country cannot exceed 50 characters" }),
  }),
  lead_time: z.coerce
    .number()
    .int({ message: "Lead time must be a whole number" })
    .min(0, { message: "Lead time cannot be negative" }),
});
