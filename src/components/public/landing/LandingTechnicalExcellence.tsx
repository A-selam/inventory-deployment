"use client";

import { Gauge, Box, Database, Code } from "lucide-react";

export default function LandingTechnicalExcellence() {
  const highlights = [
    {
      icon: Gauge,
      title: "Zero Data Loss",
      metric: "Immutable Ledger",
      description:
        "Every inventory change is recorded permanently and cannot be deleted. The complete history of every transaction is always available for audit.",
    },
    {
      icon: Box,
      title: "Deploy On Your Terms",
      metric: "Self-Hosted",
      description:
        "Install on your servers or private cloud. Your data never leaves your infrastructure. No dependency on third-party services.",
    },
    {
      icon: Database,
      title: "Atomic Accuracy",
      metric: "Guaranteed Consistency",
      description:
        "Stock can never go negative. Every transaction is fully processed or rejected—no partial updates, no lost data.",
    },
    {
      icon: Code,
      title: "Complete System",
      metric: "End-to-End",
      description:
        "Everything you need is built in: user roles, item management, transaction tracking, low-stock alerts, and reporting. No gaps to fill.",
    },
  ];

  return (
    <section className="pt-1 md:pt-5 lg:pt-15" id="capabilities">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8 bg-primary py-5 rounded-lg">
        <div className="mb-12 text-center animate-fade-in-up">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl">
            Complete System, Zero Gaps
          </h2>
          <p className="mt-4 text-lg text-primary-foreground">
            Everything required to run inventory operations is built-in and
            battle-tested.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {highlights.map((highlight, idx) => {
            const Icon = highlight.icon;
            return (
              <div
                key={idx}
                className="rounded-lg border border-border bg-card p-6 shadow-sm text-center transition-all hover:-translate-y-1 hover:shadow-lg animate-fade-in-up"
                style={{
                  animationDelay: `${idx * 100}ms`,
                }}
              >
                <div className="mb-4 flex items-center justify-center size-12 rounded-lg bg-ring/10 mx-auto">
                  <Icon className="size-6 text-ring" />
                </div>
                <p className="mb-2 text-sm font-semibold text-ring uppercase tracking-wide">
                  {highlight.metric}
                </p>
                <h3 className="mb-3 text-lg font-semibold text-primary">
                  {highlight.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {highlight.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Key capabilities */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-linear-to-br from-card to-muted p-8 transition-all hover:-translate-y-1 hover:shadow-lg animate-fade-in-left animate-delay-200">
            <h3 className="mb-4 text-xl font-semibold text-primary">
              Complete Item Management
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Manage your entire inventory from one unified system. Track SKUs,
              vendors, warehouse locations, and cost/selling prices. Bulk CSV
              import for quick data loading.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-ring" />
                Per-item vendor and location tracking
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-ring" />
                Bulk CSV import with validation
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-ring" />
                Automatic low-stock alerts and reorder reports
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-linear-to-br from-card to-muted p-8 transition-all hover:-translate-y-1 hover:shadow-lg animate-fade-in-right animate-delay-300">
            <h3 className="mb-4 text-xl font-semibold text-primary">
              Built-In Security &amp; Compliance
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Role-based access control ensures only authorized users can view
              or modify inventory. Every action is logged and fully auditable
              for compliance.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-ring" />
                Three role levels: Admin, Operator, Viewer
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-ring" />
                Complete audit trail of all transactions
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-ring" />
                Encrypted data at rest and in transit
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
