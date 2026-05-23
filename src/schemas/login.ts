import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({ message: "Enter a valid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  persistSession: z.boolean().optional(),
});

export type LoginValues = z.infer<typeof loginSchema>;
