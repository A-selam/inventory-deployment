"use client";

import { useEffect, useState } from "react";
import { Loader2, RefreshCw, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Modal from "@/components/ui/modal";
import { useDeleteVendor, useVendorsList } from "@/hooks/useVendors";
import { getApiErrorMessage } from "@/lib/api-errors";
import type { Vendor, VendorSortBy, VendorSortDir } from "@/lib/vendors";
import { useToast } from "@/providers/ToastProvider";

import VendorFilters from "./VendorFilters";
import VendorGrid from "./VendorGrid";
import VendorHeader from "./VendorHeader";
// import VendorPagination from "./VendorPagination";
import CreateVendorDrawer from "./create-vendor/CreateVendorDrawer";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const DEFAULT_SORT_BY: VendorSortBy = "name";
const DEFAULT_SORT_DIR: VendorSortDir = "asc";

function parsePositiveInt(value: string | null, fallback: number) {
  if (!value) return fallback;

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseSortBy(value: string | null): VendorSortBy {
  if (value === "contact_person" || value === "lead_time") return value;
  return DEFAULT_SORT_BY;
}

function parseSortDir(value: string | null): VendorSortDir {
  return value === "desc" ? "desc" : DEFAULT_SORT_DIR;
}

function buildVendorsHref(
  current: Pick<URLSearchParams, "toString">,
  updates: Record<string, string | number | undefined>,
) {
  const params = new URLSearchParams(current.toString());

  Object.entries(updates).forEach(([key, value]) => {
    if (value === undefined || value === "") {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
  });

  const query = params.toString();
  return query ? `/vendors?${query}` : "/vendors";
}

function VendorsErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <Card className="rounded-[12px] border-border bg-card p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="label-caps">Vendors unavailable</div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {message}
          </p>
        </div>
        <Button type="button" className="h-11 gap-2 px-4" onClick={onRetry}>
          <RefreshCw className="size-4" />
          Retry
        </Button>
      </div>
    </Card>
  );
}

export default function VendorsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const deleteVendorMutation = useDeleteVendor();
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [vendorToEdit, setVendorToEdit] = useState<Vendor | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<Vendor | null>(null);

  const page = parsePositiveInt(searchParams.get("page"), DEFAULT_PAGE);
  const limit = parsePositiveInt(searchParams.get("limit"), DEFAULT_LIMIT);
  const search = searchParams.get("search") ?? "";
  const sortBy = parseSortBy(searchParams.get("sort_by"));
  const sortDir = parseSortDir(searchParams.get("sort_dir"));

  useEffect(() => {
    const normalizedPage = searchParams.get("page");
    const normalizedLimit = searchParams.get("limit");
    const normalizedSortBy = searchParams.get("sort_by");
    const normalizedSortDir = searchParams.get("sort_dir");

    if (
      normalizedPage === String(page) &&
      normalizedLimit === String(limit) &&
      normalizedSortBy === sortBy &&
      normalizedSortDir === sortDir
    ) {
      return;
    }

    router.replace(
      buildVendorsHref(searchParams, {
        page,
        limit,
        sort_by: sortBy,
        sort_dir: sortDir,
      }),
    );
  }, [limit, page, router, searchParams, sortBy, sortDir]);

  const vendorsQuery = useVendorsList({
    page,
    limit,
    search: search || undefined,
    sort_by: sortBy,
    sort_dir: sortDir,
  });

  const vendors = vendorsQuery.data?.data ?? [];
  // const totalPages = 1;
  // const currentPage = 1;

  const confirmVendorDelete = async () => {
    if (!vendorToDelete) return;

    try {
      await deleteVendorMutation.mutateAsync(vendorToDelete.id);
      toast({
        title: "Vendor deleted",
        description: `"${vendorToDelete.name}" has been removed.`,
        variant: "success",
      });
      setIsDeleteModalOpen(false);
      setVendorToDelete(null);
    } catch (error) {
      toast({
        title: "Failed to delete vendor",
        description: getApiErrorMessage(error, "Please try again."),
        variant: "error",
      });
    }
  };

  const replaceWithResetPage = (
    updates: Record<string, string | undefined>,
  ) => {
    router.replace(
      buildVendorsHref(searchParams, {
        ...updates,
        page: DEFAULT_PAGE,
        limit,
        sort_by: updates.sort_by ?? sortBy,
        sort_dir: updates.sort_dir ?? sortDir,
      }),
    );
  };

  // const updatePage = (nextPage: number) => {
  //   router.push(
  //     buildVendorsHref(searchParams, {
  //       page: nextPage,
  //       limit,
  //       search: search || undefined,
  //       sort_by: sortBy,
  //       sort_dir: sortDir,
  //     }),
  //   );
  // };

  return (
    <div className="space-y-8">
      <VendorHeader onAddClick={() => setIsCreateDrawerOpen(true)} />

      <VendorFilters
        search={search}
        sortBy={sortBy}
        sortDir={sortDir}
        onSearchChange={(value) =>
          replaceWithResetPage({ search: value || undefined })
        }
        onSortByChange={(value) => replaceWithResetPage({ sort_by: value })}
        onSortDirChange={(value) => replaceWithResetPage({ sort_dir: value })}
        onClear={() => router.push("/vendors")}
      />

      {vendorsQuery.isError ? (
        <VendorsErrorState
          message={
            vendorsQuery.error.message || "We could not load vendors right now."
          }
          onRetry={() => vendorsQuery.refetch()}
        />
      ) : (
        <section className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Supplier network
              </h2>
              <p className="text-sm text-muted-foreground">
                {search
                  ? `Filtered by "${search}"`
                  : "Showing vendors from the connected API"}
              </p>
            </div>
            <div className="label-caps">
              Sorted by {sortBy.replace("_", " ")} - {sortDir}
            </div>
          </div>

          <VendorGrid
            vendors={vendors}
            isLoading={vendorsQuery.isLoading}
            onEditVendor={(vendor) => {
              setVendorToEdit(vendor);
              setIsEditDrawerOpen(true);
            }}
            onDeleteVendor={(vendor) => {
              setVendorToDelete(vendor);
              setIsDeleteModalOpen(true);
            }}
          />

          {/* {!vendorsQuery.isLoading && vendors.length > 0 && (
            <VendorPagination
              page={currentPage}
              totalPages={totalPages}
              limit={vendors?.limit ?? limit}
              totalItems={vendors?.total ?? 0}
              shownItems={vendors.length}
              onPageChange={updatePage}
            />
          )} */}
        </section>
      )}

      <CreateVendorDrawer
        open={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
      />
      <CreateVendorDrawer
        open={isEditDrawerOpen}
        mode="edit"
        vendor={vendorToEdit ?? undefined}
        onClose={() => {
          setIsEditDrawerOpen(false);
          setVendorToEdit(null);
        }}
      />
      <Modal
        open={isDeleteModalOpen}
        onClose={() => {
          if (deleteVendorMutation.isPending) return;
          setIsDeleteModalOpen(false);
          setVendorToDelete(null);
        }}
        title="Delete Vendor"
        description={
          vendorToDelete
            ? `This will permanently delete "${vendorToDelete.name}".`
            : "This action cannot be undone."
        }
        accent
        accentClassName="bg-destructive"
        className="max-w-md overflow-hidden rounded-xl text-left"
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl px-5"
              onClick={() => {
                if (deleteVendorMutation.isPending) return;
                setIsDeleteModalOpen(false);
                setVendorToDelete(null);
              }}
              disabled={deleteVendorMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="h-11 gap-2 rounded-xl bg-destructive px-5 text-white hover:bg-destructive/90"
              onClick={confirmVendorDelete}
              disabled={deleteVendorMutation.isPending || !vendorToDelete}
            >
              {deleteVendorMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              <span>Delete</span>
            </Button>
          </>
        }
      >
        {vendorToDelete ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              You’re about to delete:
            </p>
            <div className="rounded-[12px] border border-border bg-muted/30 p-4">
              <div className="text-sm font-semibold text-foreground">
                {vendorToDelete.name}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                ID: {vendorToDelete.id}
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
