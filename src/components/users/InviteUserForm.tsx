"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { CheckCircle2, Copy, Loader2, Mail, Send } from "lucide-react";

import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import { useInviteUser } from "@/hooks/useUsers";
import { getApiErrorMessage } from "@/lib/api-errors";
import type { InviteUserData, UserRole } from "@/lib/users";
import { inviteUserSchema, type InviteUserValues } from "@/schemas/invite-user";
import { useToast } from "@/providers/ToastProvider";
import { cn } from "@/lib/utils";

type InviteUserFormProps = {
  onCancel: () => void;
};

async function copyToClipboard(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  if (typeof document === "undefined") return;
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function formatExpiry(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export default function InviteUserForm({ onCancel }: InviteUserFormProps) {
  const { toast } = useToast();
  const inviteUserMutation = useInviteUser();
  const [invite, setInvite] = useState<InviteUserData | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<InviteUserValues>({
    resolver: standardSchemaResolver(inviteUserSchema),
    defaultValues: {
      email: "",
      role: "operator",
    },
  });

  const inviteUrl = useMemo(() => {
    if (!invite) return "";
    if (typeof window === "undefined") return "";
    const origin = window.location.origin;
    return `${origin}/register?token=${encodeURIComponent(invite.invite_token)}`;
  }, [invite]);

  async function onSubmit(values: InviteUserValues) {
    const email = values.email.trim().toLowerCase();
    if (!email) return;

    setValue("email", email, { shouldDirty: true, shouldValidate: true });

    try {
      const result = await inviteUserMutation.mutateAsync({
        email,
        role: values.role as UserRole,
      });
      setInvite(result);
      toast({
        title: "Invitation created",
        description: `An invite is ready for ${email}.`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Failed to invite user",
        description: getApiErrorMessage(error, "Please try again."),
        variant: "error",
      });
    }
  }

  const isSubmitting = inviteUserMutation.isPending;

  if (invite) {
    return (
      <div className="space-y-5">
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
              <CheckCircle2 className="size-4" />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-sm font-semibold text-foreground">
                Invite link ready
              </p>
              <p className="text-sm text-muted-foreground">
                Expires {formatExpiry(invite.expires_at)}
              </p>
              {inviteUrl ? (
                <code className="mt-2 block break-all rounded-lg bg-background px-3 py-2 font-mono text-xs text-foreground ring-1 ring-border">
                  {inviteUrl}
                </code>
              ) : (
                <code className="mt-2 block break-all rounded-lg bg-background px-3 py-2 font-mono text-xs text-foreground ring-1 ring-border">
                  {invite.invite_token}
                </code>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl px-5"
            onClick={async () => {
              const text = inviteUrl || invite.invite_token;
              await copyToClipboard(text);
              toast({
                title: "Copied to clipboard",
                description: inviteUrl
                  ? "Invitation link copied."
                  : "Token copied.",
                variant: "success",
              });
            }}
          >
            <Copy className="size-4" />
            <span>Copy</span>
          </Button>
          <Button
            type="button"
            className="h-11 rounded-xl px-5"
            onClick={() => {
              setInvite(null);
              reset({ email: "", role: "operator" });
            }}
          >
            <span>Invite Another</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="h-11 rounded-xl px-5"
            onClick={onCancel}
          >
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="invite-email" className="label-caps text-foreground">
          Email Address
        </Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="invite-email"
            placeholder="name@company.com"
            className={cn("h-11 rounded-xl pl-9 pr-4", errors.email && "pr-9")}
            autoFocus
            aria-invalid={Boolean(errors.email)}
            disabled={isSubmitting}
            inputMode="email"
            {...register("email")}
          />
        </div>
        {errors.email ? (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="invite-role" className="label-caps text-foreground">
          Assigned Role
        </Label>
        <select
          id="invite-role"
          className="h-11 w-full rounded-xl border border-input bg-card px-4 text-sm text-foreground outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-60"
          disabled={isSubmitting}
          {...register("role")}
        >
          <option value="admin">Admin</option>
          <option value="operator">Operator</option>
          <option value="viewer">Viewer</option>
        </select>
        <p className="text-xs text-muted-foreground">
          Admins have full access. Operators manage inventory. Viewers are
          read-only.
        </p>
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
          className="h-11 gap-2 rounded-xl px-5"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
          {!isSubmitting ? <Send className="size-4" /> : null}
          <span>Send Invite</span>
        </Button>
      </div>
    </form>
  );
}
