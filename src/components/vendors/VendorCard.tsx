import { Mail, MapPin, Phone, UserRound } from "lucide-react";

import Card from "@/components/ui/card";
import type { Vendor } from "@/lib/vendors";

import {
  formatVendorContactPerson,
  formatVendorLocation,
  getLeadTimeTone,
  getVendorInitials,
  getVendorStatus,
  parseVendorContactInfo,
} from "./vendor-utils";

type VendorCardProps = {
  vendor: Vendor;
};

function DetailRow({
  label,
  value,
  emphasized,
}: {
  label: string;
  value: React.ReactNode;
  emphasized?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="label-caps shrink-0">{label}</span>
      <span
        className={
          emphasized
            ? "text-right text-sm font-semibold text-destructive"
            : "text-right text-sm font-semibold text-foreground"
        }
      >
        {value}
      </span>
    </div>
  );
}

export default function VendorCard({ vendor }: VendorCardProps) {
  const status = getVendorStatus(vendor);
  const leadTimeTone = getLeadTimeTone(vendor.lead_time);
  const location = formatVendorLocation(vendor.location);
  const { phone, email, secondaryPhone } = parseVendorContactInfo(
    vendor.contact_info,
  );
  const contactPerson = formatVendorContactPerson(vendor.contact_person);

  return (
    <Card className="group rounded-[12px] border-border bg-card p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-[12px] border border-border bg-muted font-mono text-sm font-bold text-foreground">
          {getVendorInitials(vendor.name) || "VD"}
        </div>
        <span
          className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      <div className="mt-4 min-w-0">
        <h2 className="truncate text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
          {vendor.name}
        </h2>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" />
          <span className="truncate">{location || "Location unavailable"}</span>
        </p>
      </div>

      <div className="mt-5 space-y-3 border-t border-border pt-4">
        <DetailRow
          label="Contact"
          value={
            <span className="inline-flex min-w-0 items-center justify-end gap-1.5">
              <UserRound className="size-4 shrink-0 text-muted-foreground" />
              <span className="truncate">{contactPerson || "N/A"}</span>
            </span>
          }
        />
        <DetailRow
          label="Lead time"
          emphasized={leadTimeTone === "critical"}
          value={`${vendor.lead_time} day${vendor.lead_time === 1 ? "" : "s"}`}
        />
        <DetailRow
          label="Phone"
          value={
            <span className="inline-flex min-w-0 items-center justify-end gap-1.5">
              <Phone className="size-4 shrink-0 text-muted-foreground" />
              <span className="truncate">{phone || "N/A"}</span>
            </span>
          }
        />
        <DetailRow
          label="Email"
          value={
            <span className="inline-flex min-w-0 items-center justify-end gap-1.5">
              <Mail className="size-4 shrink-0 text-muted-foreground" />
              <span className="truncate">{email || "N/A"}</span>
            </span>
          }
        />
        <DetailRow label="Items" value={vendor.items_count} />
      </div>

      {secondaryPhone ? (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-[10px] bg-muted px-3 py-2 text-xs text-muted-foreground">
          <span>Secondary phone</span>
          <span className="font-medium text-foreground">{secondaryPhone}</span>
        </div>
      ) : null}

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm text-muted-foreground">
        <button
          className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          onClick={() => console.log("Edit vendor:", vendor.id)}
        >
          Edit
        </button>
        <button
          className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
          onClick={() => console.log("Delete vendor:", vendor.id)}
        >
          Delete
        </button>
      </div>
    </Card>
  );
}
