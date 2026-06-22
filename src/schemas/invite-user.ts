import { z } from "zod";

export const inviteUserSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  role: z.enum(["admin", "operator", "viewer"]),
});

export type InviteUserValues = z.infer<typeof inviteUserSchema>;

