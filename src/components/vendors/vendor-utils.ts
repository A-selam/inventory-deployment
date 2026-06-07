import type { Vendor } from "@/lib/vendors";

export function formatVendorLocation(location: Vendor["location"]) {
  return [location.city, location.country].filter(Boolean).join(", ");
}

export function getVendorInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function getLeadTimeTone(leadTime: number) {
  if (leadTime >= 30) return "critical";
  if (leadTime >= 14) return "slow";
  return "normal";
}

export function getVendorStatus(vendor: Vendor) {
  if (!vendor.is_active) {
    return {
      label: "Inactive",
      className:
        "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
    };
  }

  const leadTimeTone = getLeadTimeTone(vendor.lead_time);

  if (leadTimeTone === "critical") {
    return {
      label: "High delay",
      className:
        "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300",
    };
  }

  if (leadTimeTone === "slow") {
    return {
      label: "Watch",
      className:
        "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300",
    };
  }

  return {
    label: "Active",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300",
  };
}

export function getAverageLeadTime(vendors: Vendor[]) {
  if (vendors.length === 0) return 0;
  const total = vendors.reduce((sum, vendor) => sum + vendor.lead_time, 0);
  return Math.round(total / vendors.length);
}
