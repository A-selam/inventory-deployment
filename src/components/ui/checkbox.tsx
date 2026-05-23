"use client"

import React from "react";
import { cn } from "@/lib/utils";

export default function Checkbox(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="checkbox"
      className={cn("h-4 w-4 rounded-sm border border-input bg-card text-primary focus-visible:ring-2 focus-visible:ring-ring/50", props.className)}
      {...props}
    />
  );
}
