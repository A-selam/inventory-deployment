import React from "react";
import { cn } from "@/lib/utils";

export default function Label({
  className,
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "block text-xs font-medium text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </label>
  );
}
