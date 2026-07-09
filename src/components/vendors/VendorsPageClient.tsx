"use client";

import { useEffect, useState } from "react";
import {
  Eye,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Modal from "@/components/ui/modal";
import { useDeleteVendor, useVendorsList } from "@/hooks/useVendors";
import { getApiErrorMessage } from "@/lib/api-errors";
import type { Vendor, VendorSortBy, VendorSortDir } from "@/lib/vendors";
import { useToast } from "@/providers/ToastProvider";

import VendorFilters from "./VendorFilters";
import CreateVendorDrawer from "./create-vendor/CreateVendorDrawer";

type ComplexContactPerson = {
  name?: string;
  first_name?: string;
  last_name?: string;
};

type DashboardVendor = Omit<Vendor, "contact_person"> & {
  contact_person?: string | ComplexContactPerson | null;
  email?: string;
  status?: "active" | "inactive" | string;
  total_items?: number;
  phone?: string;
  address?: string;
  notes?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
};

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

function formatContactPerson(contact: DashboardVendor["contact_person"]): string {
  if (!contact) return "—";
  if (typeof contact === "string") return contact;
  
  if (contact.name) return contact.name;
  if (contact.first_name || contact.last_name) {
    return `${contact.first_name ?? ""} ${contact.last_name ?? ""}`.trim();
  }
  
  return "—";
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
          <div className="label-caps">Suppliers unavailable</div>
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

/* --- Read-Only Vendor Details Modal Component --- */
function ViewVendorModal({
  open,
  vendor,
  onClose,
  onEdit,
}: {
  open: boolean;
  vendor: DashboardVendor | null;
  onClose: () => void;
  onEdit: () => void;
}) {
  if (!vendor) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Supplier Information"
      className="max-w-2xl overflow-hidden rounded-xl text-left"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl px-5"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            type="button"
            className="h-11 gap-2 rounded-xl px-5"
            onClick={onEdit}
          >
            <Pencil className="size-4" />
            <span>Edit Profile</span>
          </Button>
        </>
      }
    >
      <div className="mt-4 space-y-6 max-h-[60vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Company Name</span>
            <span className="text-sm font-medium text-foreground">{vendor.name}</span>
          </div>
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Status</span>
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium mt-1 ${
              vendor.status === "active" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
            }`}>
              {vendor.status || "Unknown"}
            </span>
          </div>
        </div>


        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Contact Person</span>
            <span className="text-sm text-foreground">{formatContactPerson(vendor.contact_person)}</span>
          </div>
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Phone Number</span>
            <span className="text-sm text-foreground">{vendor.phone || "—"}</span>
          </div>
          <div className="sm:col-span-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Email Address</span>
            <span className="text-sm text-foreground">{vendor.email || "—"}</span>
          </div>
        </div>

        {/* <hr className="border-border" /> */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Physical Address</span>
          <span className="text-sm text-foreground whitespace-pre-wrap">{vendor.address || "No address provided."}</span>
        </div>
        <div>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Internal Notes</span>
          <span className="text-sm text-foreground whitespace-pre-wrap">{vendor.notes || "No operational notes recorded."}</span>
        </div>
      </div>

        {/* <hr className="border-border" /> */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 bg-muted/40 p-4 rounded-xl border border-border">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Total Items</span>
            <span className="text-lg font-semibold text-foreground">{vendor.total_items ?? 0}</span>
          </div>
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Created At</span>
            <span className="text-xs text-foreground mt-1 block">
              {vendor.created_at ? new Date(vendor.created_at).toLocaleDateString() : "—"}
            </span>
          </div>
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Last Updated</span>
            <span className="text-xs text-foreground mt-1 block">
              {vendor.updated_at ? new Date(vendor.updated_at).toLocaleDateString() : "—"}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default function VendorsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const deleteVendorMutation = useDeleteVendor();
  
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [vendorToEdit, setVendorToEdit] = useState<DashboardVendor | null>(null);
  
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [vendorToView, setVendorToView] = useState<DashboardVendor | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<DashboardVendor | null>(null);

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

  const vendors = (vendorsQuery.data?.data ?? []) as unknown as DashboardVendor[];

  const confirmVendorDelete = async () => {
    if (!vendorToDelete) return;

    try {
      await deleteVendorMutation.mutateAsync(vendorToDelete.id);
      toast({
        title: "Supplier deleted",
        description: `"${vendorToDelete.name}" has been removed.`,
        variant: "success",
      });
      setIsDeleteModalOpen(false);
      setVendorToDelete(null);
    } catch (error) {
      toast({
        title: "Failed to delete supplier",
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

  return (
    <div className="space-y-8">
      {vendorsQuery.isError ? (
        <VendorsErrorState
          message={
            vendorsQuery.error.message ||
            "We could not load suppliers right now."
          }
          onRetry={() => vendorsQuery.refetch()}
        />
      ) : (
        <section className="space-y-4">
          <Card className="rounded-[12px] border border-border bg-card p-0 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="flex flex-col gap-3 border-b border-border bg-background px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h2 className="truncate text-base font-semibold text-foreground">
                  List of suppliers
                </h2>
                <p className="text-xs text-muted-foreground">
                  {search
                    ? `Filtered by "${search}"`
                    : "Showing suppliers from the connected API"}{" "}
                  • Sorted by {sortBy.replace("_", " ")} ({sortDir})
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <Button
                  type="button"
                  variant={filtersOpen ? "default" : "outline"}
                  size="sm"
                  className="h-9 gap-2"
                  onClick={() => setFiltersOpen((prev) => !prev)}
                >
                  <SlidersHorizontal className="size-4" />
                  Filters
                </Button>

                <Button
                  type="button"
                  size="sm"
                  className="h-9 gap-2"
                  onClick={() => setIsCreateDrawerOpen(true)}
                >
                  <Plus className="size-4" />
                  Add Supplier
                </Button>
              </div>
            </div>

            {filtersOpen ? (
              <div className="bg-background px-4 py-3">
                <VendorFilters
                  sortBy={sortBy}
                  sortDir={sortDir}
                  onSortByChange={(value) =>
                    replaceWithResetPage({ sort_by: value })
                  }
                  onSortDirChange={(value) =>
                    replaceWithResetPage({ sort_dir: value })
                  }
                  onClear={() => router.push("/vendors")}
                />
              </div>
            ) : null}
          </Card>

          <div className="overflow-hidden rounded-[12px] border border-border bg-card shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-medium">Supplier Name</th>
                    {/* <th className="px-6 py-4 font-medium">Contact Person</th>
                    <th className="px-6 py-4 font-medium">Phone</th>
                    <th className="px-6 py-4 font-medium">Email</th> */}
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-center">Total Items</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-background">
                  {vendorsQuery.isLoading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="size-5 animate-spin text-primary" />
                          <span>Retrieving suppliers...</span>
                        </div>
                      </td>
                    </tr>
                  ) : vendors.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                        No suppliers found matching your selection.
                      </td>
                    </tr>
                  ) : (
                    vendors.map((vendor) => (
                      <tr 
                        key={vendor.id} 
                        className="hover:bg-muted/20 transition-colors group cursor-pointer"
                        onClick={() => {
                          setVendorToView(vendor);
                          setIsViewModalOpen(true);
                        }}
                      >
                        <td className="px-6 py-4 font-medium text-foreground group-hover:text-primary transition-colors">
                          {vendor.name}
                        </td>
                        {/*<td className="px-6 py-4 text-muted-foreground">
                          {formatContactPerson(vendor.contact_person)}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">{vendor.phone || "—"}</td>
                        <td className="px-6 py-4 text-muted-foreground">{vendor.email || "—"}</td> */}
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            vendor.status === "active" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                          }`}>
                            {vendor.status || "Unknown"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center font-medium text-foreground">{vendor.total_items ?? 0}</td>
                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="View Details"
                              onClick={() => {
                                setVendorToView(vendor);
                                setIsViewModalOpen(true);
                              }}
                            >
                              <Eye className="size-4 text-muted-foreground hover:text-foreground" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="Edit Supplier"
                              onClick={() => {
                                setVendorToEdit(vendor);
                                setIsEditDrawerOpen(true);
                              }}
                            >
                              <Pencil className="size-4 text-muted-foreground hover:text-foreground" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                              title="Delete Supplier"
                              onClick={() => {
                                setVendorToDelete(vendor);
                                setIsDeleteModalOpen(true);
                              }}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      <ViewVendorModal 
        open={isViewModalOpen}
        vendor={vendorToView}
        onClose={() => {
          setIsViewModalOpen(false);
          setVendorToView(null);
        }}
        onEdit={() => {
          if (!vendorToView) return;
          setVendorToEdit(vendorToView);
          setIsViewModalOpen(false);
          setVendorToView(null);
          setIsEditDrawerOpen(true);
        }}
      />

      <CreateVendorDrawer
        open={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
      />
      <CreateVendorDrawer
        open={isEditDrawerOpen}
        mode="edit"
        vendor={vendorToEdit as unknown as Vendor | undefined}
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
        title="Delete Supplier"
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