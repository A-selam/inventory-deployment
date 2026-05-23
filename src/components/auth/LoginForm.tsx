"use client";

import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { loginSchema, type LoginValues } from "@/schemas/login";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import Checkbox from "@/components/ui/checkbox";
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginForm({ redirect }: { redirect?: string }) {
  const router = useRouter();
  const { loginMutation } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: standardSchemaResolver(loginSchema),
  });

  async function onSubmit(data: LoginValues) {
    try {
      await loginMutation.mutateAsync(data);
      router.push(redirect || "/");
    } catch (error) {
      console.error(error);
    }
  }

  function getErrorMessage(err: unknown) {
    if (!err) return "Failed to sign in";
    if (err instanceof Error) return err.message;
    try {
      return String(err);
    } catch {
      return "Failed to sign in";
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="relative">
        <Label className="mb-1">EMAIL ADDRESS</Label>
        <div className="relative">
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Mail className="size-4" />
          </div>
          <Input
            placeholder="name@company.com"
            className="pl-10"
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-xs text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="relative">
        <div className="flex items-center justify-between mb-1">
          <Label>PASSWORD</Label>
          {/* <a className="text-sm text-primary" href="#">
            Forgot password?
          </a> */}
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Lock className="size-4" />
          </div>
          <Input
            type="password"
            className="pl-10"
            placeholder="••••••••"
            {...register("password")}
          />
        </div>
        {errors.password && (
          <p className="mt-1 text-xs text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Checkbox {...register("persistSession")} />
        <Label className="text-sm!">Keep me signed in</Label>
      </div>

      <div>
        <Button
          type="submit"
          className="w-full flex items-center justify-center gap-2"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
          <span>Sign In</span>
        </Button>
      </div>

      {loginMutation.isError && (
        <div className="text-sm text-destructive">
          {getErrorMessage(loginMutation.error)}
        </div>
      )}
    </form>
  );
}
