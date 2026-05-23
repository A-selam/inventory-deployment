"use client"

import React from "react";
import { cn } from "@/lib/utils";

export default function Button({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md bg-primary px-4 py-3 text-base font-semibold text-primary-foreground shadow transition-opacity disabled:opacity-60 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
