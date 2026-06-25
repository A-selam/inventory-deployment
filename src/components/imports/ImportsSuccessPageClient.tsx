"use client";

import { useRouter, useSearchParams } from "next/navigation";

import ImportsPageFrame from "@/components/imports/ImportsPageFrame";
import ImportsSuccessCard from "@/components/imports/ImportsSuccessCard";
import type { ImportsWizardStep } from "@/components/imports/ImportsWizard";

function parseNumber(value: string | null | undefined) {
  if (!value) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function ImportsSuccessPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const records = parseNumber(searchParams.get("records"));

  const wizardSteps: ImportsWizardStep[] = [
    { key: "upload", label: "Upload", state: "complete" },
    { key: "validate", label: "Validate", state: "complete" },
    { key: "finish", label: "Finish", state: "active" },
  ];

  return (
    <ImportsPageFrame wizardSteps={wizardSteps}>
      <ImportsSuccessCard
        records={records}
        onViewInventory={() => router.push("/inventory")}
        onImportAnother={() => router.push("/imports")}
      />
    </ImportsPageFrame>
  );
}

