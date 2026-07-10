"use client";

import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import ImportsRecentHistoryCard from "@/components/imports/ImportsRecentHistoryCard";
import ImportsWizard, {
  type ImportsWizardStep,
} from "@/components/imports/ImportsWizard";

type ImportsPageFrameProps = {
  wizardSteps: ImportsWizardStep[];
  children: ReactNode;
};

export default function ImportsPageFrame({
  wizardSteps,
  children,
}: ImportsPageFrameProps) {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <Link
          href="/inventory"
          className="inline-flex items-center gap-1 hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to inventory
        </Link>
      </div>
      </div>

      <ImportsWizard steps={wizardSteps} />

      {children}

      <div>
        <ImportsRecentHistoryCard />
      </div>
    </div>
  );
}
