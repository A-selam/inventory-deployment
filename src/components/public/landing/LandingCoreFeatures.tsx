"use client";

import { Database, Zap, Lock, Upload, Bell, TrendingUp } from "lucide-react";

export default function LandingCoreFeatures() {
  const features = [
    {
      icon: Database,
      title: "Immutable Transaction Ledger",
      description:
        "Every inventory movement is recorded permanently and never deleted. Complete audit trail showing what changed, when, and who did it. Essential for compliance and investigations.",
    },
    {
      icon: Zap,
      title: "Atomic Accuracy Guaranteed",
      description:
        "Inventory quantity can never go negative. Stock movements are all-or-nothing—either the entire transaction succeeds or it fails completely. No partial updates, no data inconsistency.",
    },
    {
      icon: Lock,
      title: "Role-Based Access Control",
      description:
        "Three built-in roles—Admin, Operator, Viewer—give each team member exactly the access they need. Fine-grained permissions prevent unauthorized changes.",
    },
    {
      icon: Upload,
      title: "Bulk CSV Operations",
      description:
        "Load thousands of items at once with CSV import. Entire upload is validated before any data is saved. If any row has errors, the whole batch is rejected with detailed error reporting.",
    },
    {
      icon: Bell,
      title: "Automatic Reorder Alerts",
      description:
        "Intelligent low-stock detection evaluates items against minimum thresholds. Automatic reorder report grouped by vendor so you know exactly what to buy and from whom.",
    },
    {
      icon: TrendingUp,
      title: "Real-Time Dashboard &amp; Reporting",
      description:
        "Live inventory visibility with charts, movement analysis, and vendor reports. Make data-driven decisions about stock levels, cash flow, and procurement priorities.",
    },
  ];

  return (
    <section className="pt-6 md:pt-10 lg:pt-20" id="core-features">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center animate-fade-in-up">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-primary sm:text-4xl lg:text-5xl">
            Full-Stack Inventory System
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything required for enterprise inventory control. No missing
            pieces, no compromises.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:border-ring/50 animate-fade-in-up"
                style={{
                  animationDelay: `${idx * 100}ms`,
                }}
              >
                <div className="mb-4 flex items-center justify-center size-10 rounded-lg bg-ring/10">
                  <Icon className="size-5 text-ring" />
                </div>
                <h3 className="mb-3 text-lg font-semibold text-primary">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
