import React from "react";
import Card from "@/components/ui/card";
import { Archive } from "lucide-react";

type AuthShellProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
};

export default function AuthShell({
  children,
  title = "Sign In",
  description = "Enter your credentials to manage your inventory.",
  footer = (
    <div className="mt-2 text-center text-sm text-muted-foreground">
      <span>Have an invitation? </span>
      <a className="font-medium text-primary" href="/register">
        Accept Invitation
      </a>
    </div>
  ),
}: AuthShellProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
            <Archive className="size-6" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">StockLogic</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Secure Warehouse Access.
          </p>
        </div>

        <Card>
          <h1 className="text-3xl font-semibold text-foreground">{title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>

          <div className="mt-6">{children}</div>

          <div className="my-4 h-px bg-border" />

          {footer}
        </Card>
      </div>
    </div>
  );
}
