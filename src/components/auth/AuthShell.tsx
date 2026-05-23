import React from "react";
import Card from "@/components/ui/card";
import { Archive } from "lucide-react";

export default function AuthShell({ children }: { children: React.ReactNode }) {
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
          <h1 className="text-3xl font-semibold text-foreground">Sign In</h1>
          <p className="text-sm text-muted-foreground mt-1.5 mb-6">
            Enter your credentials to manage your inventory.
          </p>

          {children}

          <div className="my-4 h-px bg-border" />

          <div className="mt-2 text-center text-sm text-muted-foreground">
            <span>Don&apos;t have an account? </span>
            <a className="font-medium text-primary" href="/register">
              Request Access
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
