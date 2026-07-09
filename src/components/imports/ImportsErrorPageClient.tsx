"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

import ImportsErrorCard from "@/components/imports/ImportsErrorCard";
import ImportsPageFrame from "@/components/imports/ImportsPageFrame";
import type { ImportsWizardStep } from "@/components/imports/ImportsWizard";
import EmptyState from "@/components/shared/EmptyState";
import type { ImportCsvError } from "@/lib/imports";

const IMPORT_ERRORS_STORAGE_KEY = "imports:lastErrors";

type StoredErrorsPayload = {
  file_name?: string;
  errors?: ImportCsvError[];
};

export default function ImportsErrorPageClient() {
  const router = useRouter();
  const [payload, setPayload] = useState<StoredErrorsPayload | null>(null);

  useEffect(() => {
    const raw = window.sessionStorage.getItem(IMPORT_ERRORS_STORAGE_KEY);
    let next: StoredErrorsPayload = { errors: [] };

    if (raw) {
      try {
        next = JSON.parse(raw) as StoredErrorsPayload;
      } catch {
        next = { errors: [] };
      }
    }

    Promise.resolve().then(() => setPayload(next));
  }, []);

  const errors = payload?.errors ?? [];
  const fileName = payload?.file_name ?? null;

  const wizardSteps: ImportsWizardStep[] = [
    { key: "upload", label: "Upload", state: "complete" },
    { key: "validate", label: "Validate", state: "active" },
    { key: "finish", label: "Finish", state: "pending" },
  ];

  return (
    <ImportsPageFrame wizardSteps={wizardSteps}>
      {errors.length ? (
        <ImportsErrorCard
          errors={errors}
          fileName={fileName}
          onReupload={() => router.push("/imports")}
        />
      ) : (
        <EmptyState
          icon={AlertTriangle}
          title="No validation errors found"
          description="We couldn't find an error log for this import attempt. Try uploading your file again."
          actionLabel="Back to imports"
          onAction={() => router.push("/imports")}
        />
      )}
    </ImportsPageFrame>
  );
}
