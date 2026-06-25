"use client";

import { useRouter } from "next/navigation";

import ImportFileDropzone from "@/components/imports/ImportFileDropzone";
import ImportsPageFrame from "@/components/imports/ImportsPageFrame";
import type { ImportsWizardStep } from "@/components/imports/ImportsWizard";
import { useImportCsv } from "@/hooks/useImports";
import { getApiErrorMessage } from "@/lib/api-errors";
import { useToast } from "@/providers/ToastProvider";

const IMPORT_ERRORS_STORAGE_KEY = "imports:lastErrors";

export default function ImportsUploadPageClient() {
  const router = useRouter();
  const { toast } = useToast();
  const importCsvMutation = useImportCsv();

  const wizardSteps: ImportsWizardStep[] = [
    { key: "upload", label: "Upload", state: "active" },
    { key: "validate", label: "Validate", state: "pending" },
    { key: "finish", label: "Finish", state: "pending" },
  ];

  const onFileSelected = async (file: File) => {
    try {
      const result = await importCsvMutation.mutateAsync(file);

      if (result.status === "success") {
        const params = new URLSearchParams();
        params.set("records", String(result.records ?? 0));
        params.set("file", file.name);
        router.push(`/imports/success?${params.toString()}`);
        return;
      }

      window.sessionStorage.setItem(
        IMPORT_ERRORS_STORAGE_KEY,
        JSON.stringify({
          file_name: file.name,
          errors: result.errors ?? [],
        }),
      );
      router.push("/imports/error");
    } catch (error) {
      toast({
        title: "Import failed",
        description: getApiErrorMessage(error, "We could not upload that file."),
        variant: "error",
      });
    }
  };

  return (
    <ImportsPageFrame wizardSteps={wizardSteps}>
      <ImportFileDropzone
        disabled={importCsvMutation.isPending}
        onFileSelected={onFileSelected}
      />
    </ImportsPageFrame>
  );
}

