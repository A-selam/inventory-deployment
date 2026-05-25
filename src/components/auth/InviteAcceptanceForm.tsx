"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2, Lock, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import useAuth from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/api-errors";
import { inviteSchema, type InviteValues } from "@/schemas/invite";

type InviteAcceptanceFormProps = {
  token?: string;
};

export default function InviteAcceptanceForm({
  token,
}: InviteAcceptanceFormProps) {
  const router = useRouter();
  const { acceptInviteMutation } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<InviteValues>({
    resolver: standardSchemaResolver(inviteSchema),
  });

  useEffect(() => {
    if (!token) {
      setError("password", {
        type: "validate",
        message: "Open your invitation link to continue.",
      });
    }
  }, [setError, token]);

  async function onSubmit(values: InviteValues) {
    if (!token) return;

    await acceptInviteMutation.mutateAsync({ ...values, token });
    router.replace("/login?invited=1");
  }

  const isSubmitting = acceptInviteMutation.isPending;
  const missingToken = !token;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="rounded-lg border border-border bg-muted/60 p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
            <ShieldCheck className="size-4" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              Invitation token
            </p>
            <p className="text-sm text-muted-foreground">
              {token
                ? "Your invitation is ready to be activated."
                : "No token was found in this link."}
            </p>
            {token ? (
              <code className="block break-all rounded-md bg-background px-2 py-1 font-mono text-xs text-foreground ring-1 ring-border">
                {token}
              </code>
            ) : null}
          </div>
        </div>
      </div>

      {missingToken ? (
        <div className="flex items-start gap-3 rounded-lg border border-border bg-accent/60 p-4 text-sm text-foreground">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
          <p>
            Use the invitation link sent by your administrator. If the token has
            expired, request a new invite.
          </p>
        </div>
      ) : null}

      <div className="space-y-1.5">
        <Label>PASSWORD</Label>
        <div className="relative">
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Lock className="size-4" />
          </div>
          <Input
            type="password"
            placeholder="Create a password"
            className="pl-10"
            aria-invalid={Boolean(errors.password)}
            disabled={missingToken}
            {...register("password")}
          />
        </div>
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label>CONFIRM PASSWORD</Label>
        <div className="relative">
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Lock className="size-4" />
          </div>
          <Input
            type="password"
            placeholder="Repeat your password"
            className="pl-10"
            aria-invalid={Boolean(errors.confirmPassword)}
            disabled={missingToken}
            {...register("confirmPassword")}
          />
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="flex w-full items-center justify-center gap-2"
        disabled={isSubmitting || missingToken}
      >
        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
        <span>Accept Invitation</span>
      </Button>

      {acceptInviteMutation.isError && (
        <p className="text-sm text-destructive">
          {getApiErrorMessage(
            acceptInviteMutation.error,
            "Failed to accept invitation",
          )}
        </p>
      )}
    </form>
  );
}
