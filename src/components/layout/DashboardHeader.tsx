"use client";

import {
  Building2,
  Loader2,
  Menu,
  Package,
  Search,
  Settings,
} from "lucide-react";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";

import ProfileCard from "@/components/shared/ProfileCard";
import { useSidebar } from "@/components/layout/DashboardShell";
import { Input } from "@/components/ui/input";
import { useDashboardSearch } from "@/hooks/useDashboard";
import Card from "@/components/ui/card";
import NotificationsBell from "@/components/notifications/NotificationsBell";
import { cn } from "@/lib/utils";

const EMPTY_INVENTORY: Array<{
  id: string;
  name: string;
  sku: string;
  qty: number;
}> = [];

const EMPTY_VENDORS: Array<{
  id: string;
  name: string;
  email: string;
}> = [];

export default function DashboardHeader() {
  const { setMobileOpen } = useSidebar();
  const router = useRouter();
  const resultsId = useId();

  const containerRef = useRef<HTMLDivElement | null>(null);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleOutsidePointerDown = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!containerRef.current) return;
      if (!containerRef.current.contains(target)) setOpen(false);
    };

    document.addEventListener("mousedown", handleOutsidePointerDown);
    return () =>
      document.removeEventListener("mousedown", handleOutsidePointerDown);
  }, []);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 250);

    return () => window.clearTimeout(handle);
  }, [query]);

  const effectiveQuery = debouncedQuery.length >= 2 ? debouncedQuery : "";
  const searchQuery = useDashboardSearch(effectiveQuery);

  const inventory = searchQuery.data?.data.inventory ?? EMPTY_INVENTORY;
  const vendors = searchQuery.data?.data.vendors ?? EMPTY_VENDORS;

  type ResultRow =
    | {
        kind: "inventory";
        id: string;
        name: string;
        sku: string;
        qty: number;
      }
    | {
        kind: "vendor";
        id: string;
        name: string;
        email: string;
      };

  const flatResults = useMemo<ResultRow[]>(() => {
    const rows: ResultRow[] = [];
    inventory.forEach((item) => {
      rows.push({
        kind: "inventory",
        id: item.id,
        name: item.name,
        sku: item.sku,
        qty: item.qty,
      });
    });
    vendors.forEach((vendor) => {
      rows.push({
        kind: "vendor",
        id: vendor.id,
        name: vendor.name,
        email: vendor.email,
      });
    });
    return rows;
  }, [inventory, vendors]);

  const selectResult = (result: ResultRow) => {
    setOpen(false);

    if (result.kind === "inventory") {
      router.push(`/inventory/${result.id}`);
      return;
    }

    const params = new URLSearchParams();
    params.set("search", result.name);
    router.push(`/vendors?${params.toString()}`);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setOpen(false);
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      return;
    }

    if (!open) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (flatResults.length === 0) return;
      setActiveIndex((current) => (current + 1) % flatResults.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (flatResults.length === 0) return;
      setActiveIndex((current) =>
        current - 1 < 0 ? flatResults.length - 1 : current - 1,
      );
      return;
    }

    if (event.key === "Enter") {
      if (flatResults.length > 0) {
        event.preventDefault();
        const selected = flatResults[Math.max(0, activeIndex)];
        if (selected) selectResult(selected);
        return;
      }

      const raw = query.trim();
      if (raw.length > 0) {
        event.preventDefault();
        const params = new URLSearchParams();
        params.set("search", raw);
        router.push(`/inventory?${params.toString()}`);
        setOpen(false);
      }
    }
  };

  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-border bg-card px-4 sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-md text-muted-foreground hover:bg-muted lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
        >
          <Menu className="size-5" />
        </button>
        <div
          ref={containerRef}
          className="relative min-w-0 flex-1 max-w-xl"
          role="combobox"
          aria-expanded={open}
          aria-controls={resultsId}
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Search inventory and vendors"
            placeholder="Search inventory and vendors..."
            className="h-10 bg-muted pl-10 pr-10 text-foreground"
            value={query}
            onFocus={() => {
              setOpen(true);
              setActiveIndex(0);
            }}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
          {searchQuery.isFetching && effectiveQuery ? (
            <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          ) : null}

          {open ? (
            <div
              id={resultsId}
              className="absolute left-0 right-0 top-full z-50 mt-2"
            >
              <Card className="overflow-hidden rounded-[14px] border-border bg-card p-0 shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <div className="label-caps">Search results</div>
                  <div className="text-xs text-muted-foreground">
                    {query.trim().length < 2
                      ? "Type 2+ characters"
                      : flatResults.length === 0 && !searchQuery.isFetching
                        ? "No matches"
                        : `${flatResults.length} match${
                            flatResults.length === 1 ? "" : "es"
                          }`}
                  </div>
                </div>

                {query.trim().length < 2 ? (
                  <div className="px-4 py-4 text-sm text-muted-foreground">
                    Search across inventory items and vendors.
                  </div>
                ) : searchQuery.isError ? (
                  <div className="px-4 py-4 text-sm text-rose-600">
                    {searchQuery.error instanceof Error
                      ? searchQuery.error.message
                      : "Search failed"}
                  </div>
                ) : flatResults.length === 0 ? (
                  <div className="px-4 py-4 text-sm text-muted-foreground">
                    No results for “{query.trim()}”.
                  </div>
                ) : (
                  <div className="max-h-[340px] overflow-auto">
                    {inventory.length > 0 ? (
                      <div className="border-b border-border">
                        <div className="px-4 pt-4 pb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                          Inventory
                        </div>
                        <div className="px-2 pb-3">
                          {inventory.map((item) => {
                            const idx = flatResults.findIndex(
                              (row) =>
                                row.kind === "inventory" && row.id === item.id,
                            );

                            return (
                              <button
                                key={item.id}
                                type="button"
                                className={cn(
                                  "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                                  idx === activeIndex
                                    ? "bg-sidebar-accent"
                                    : "hover:bg-muted",
                                )}
                                onMouseEnter={() => setActiveIndex(idx)}
                                onClick={() =>
                                  selectResult({
                                    kind: "inventory",
                                    id: item.id,
                                    name: item.name,
                                    sku: item.sku,
                                    qty: item.qty,
                                  })
                                }
                              >
                                <div className="flex size-9 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground">
                                  <Package className="size-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="truncate text-sm font-semibold text-foreground">
                                    {item.name}
                                  </div>
                                  <div className="truncate text-xs text-muted-foreground">
                                    SKU {item.sku} • Qty {item.qty}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}

                    {vendors.length > 0 ? (
                      <div>
                        <div className="px-4 pt-4 pb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                          Vendors
                        </div>
                        <div className="px-2 pb-3">
                          {vendors.map((vendor) => {
                            const idx = flatResults.findIndex(
                              (row) =>
                                row.kind === "vendor" && row.id === vendor.id,
                            );

                            return (
                              <button
                                key={vendor.id}
                                type="button"
                                className={cn(
                                  "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                                  idx === activeIndex
                                    ? "bg-sidebar-accent"
                                    : "hover:bg-muted",
                                )}
                                onMouseEnter={() => setActiveIndex(idx)}
                                onClick={() =>
                                  selectResult({
                                    kind: "vendor",
                                    id: vendor.id,
                                    name: vendor.name,
                                    email: vendor.email,
                                  })
                                }
                              >
                                <div className="flex size-9 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground">
                                  <Building2 className="size-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="truncate text-sm font-semibold text-foreground">
                                    {vendor.name}
                                  </div>
                                  <div className="truncate text-xs text-muted-foreground">
                                    {vendor.email}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </Card>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <NotificationsBell />
        <button
          type="button"
          className="hidden size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground sm:inline-flex"
          aria-label="Settings"
        >
          <Settings className="size-4" />
        </button>

        <ProfileCard />
      </div>
    </header>
  );
}
