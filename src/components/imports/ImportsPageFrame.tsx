"use client";

import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

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
        <div className="flex items-center gap-2 label-caps">
          <span>Inventory</span>
          <ChevronRight className="size-3 opacity-70" />
          <span className="text-foreground">Bulk Import</span>
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
