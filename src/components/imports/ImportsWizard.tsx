"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export type ImportsWizardStep = {
  key: "upload" | "validate" | "finish";
  label: string;
  state: "pending" | "active" | "complete";
};

function StepCircle({
  state,
  label,
  index,
}: {
  state: ImportsWizardStep["state"];
  label: string;
  index: number;
}) {
  return (
    <div
      className={cn(
        "flex size-10 items-center justify-center rounded-full border text-sm font-semibold",
        state === "complete" && "border-primary bg-primary text-primary-foreground",
        state === "active" && "border-primary bg-primary text-primary-foreground",
        state === "pending" && "border-border bg-card text-muted-foreground",
      )}
      aria-label={label}
    >
      {state === "complete" ? <Check className="size-5" /> : <span>{index + 1}</span>}
    </div>
  );
}

function StepLabel({ active, label }: { active: boolean; label: string }) {
  return (
    <span className={cn("label-caps mt-2", active ? "text-foreground" : "text-muted-foreground")}>
      {label}
    </span>
  );
}

export default function ImportsWizard({ steps }: { steps: ImportsWizardStep[] }) {
  return (
    <div className="relative">
      <div className="absolute left-0 top-5 h-px w-full bg-border" />
      <div className="relative flex justify-around items-center">
        {steps.map((step, idx) => (
          <div
            key={step.key}
            className={cn("flex flex-col items-center bg-background px-2", idx === 0 && "items-start", idx === steps.length - 1 && "items-end")}
          >
            <StepCircle state={step.state} label={step.label} index={idx} />
            <StepLabel active={step.state !== "pending"} label={step.label} />
          </div>
        ))}
      </div>
    </div>
  );
}
