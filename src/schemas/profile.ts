import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  profile_picture: z.string().url({ message: "Enter a valid URL" }).or(z.literal("")).optional(),
});

export type UpdateProfileValues = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, { message: "Current password is required" }),
    new_password: z
      .string()
      .min(8, { message: "New password must be at least 8 characters" }),
    confirm_new_password: z
      .string()
      .min(8, { message: "Confirm your new password" }),
  })
  .refine((v) => v.new_password === v.confirm_new_password, {
    message: "Passwords do not match",
    path: ["confirm_new_password"],
  });

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export const forgotPasswordSchema = z.object({
  email: z.email({ message: "Enter a valid email address" }),
});

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    reset_token: z.string().min(1, { message: "Reset token is required" }),
    new_password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirm_new_password: z
      .string()
      .min(8, { message: "Confirm your new password" }),
  })
  .refine((v) => v.new_password === v.confirm_new_password, {
    message: "Passwords do not match",
    path: ["confirm_new_password"],
  });

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
