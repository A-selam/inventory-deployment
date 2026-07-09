import { z } from "zod";

export const inviteSchema = z
  .object({
    name: z.string().trim().min(1, { message: "Full name is required" }),
    email: z.string().trim().email({ message: "Enter a valid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(50, { message: "Password cannot exceed 50 characters" }),
    confirmPassword: z.string().min(8, { message: "Confirm your password" }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type InviteValues = z.infer<typeof inviteSchema>;
