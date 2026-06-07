export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCompactCount(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

export function getVendorInitials(vendorName: string) {
  return vendorName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);
}

export function getStockLevel(currentStock: number, threshold: number) {
  if (currentStock <= 0) return "Out of stock";
  if (currentStock <= Math.max(1, Math.floor(threshold * 0.5))) {
    return "Critical low";
  }
  if (currentStock < threshold) return "Low stock";
  return "Healthy";
}

export function getStockLevelClass(level: string) {
  switch (level) {
    case "Out of stock":
    case "Critical low":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "Low stock":
      return "border-amber-200 bg-amber-50 text-amber-700";
    default:
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
}
