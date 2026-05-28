"use client"

import React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "outline" | "ghost";
type ButtonSize = "default" | "sm" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  children,
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed",
        {
          // Variants
          "bg-primary px-4 py-3 text-base text-primary-foreground shadow hover:bg-opacity-90":
            variant === "default",
          "border border-border bg-card px-4 py-3 text-base text-foreground hover:bg-muted":
            variant === "outline",
          "px-4 py-3 text-base text-foreground hover:bg-muted": variant === "ghost",
          // Sizes
          "px-3 py-2 text-sm": size === "sm",
          "px-4 py-3 text-base": size === "default",
          "px-6 py-4 text-lg": size === "lg",
        },
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
