import React from "react";
import { cn } from "@/lib/utils";

export default function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-md border border-border bg-card p-6 shadow-lg ring-1 ring-foreground/3",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
