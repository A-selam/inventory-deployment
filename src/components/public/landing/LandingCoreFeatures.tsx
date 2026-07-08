'use client';

import { Database, Zap, Lock, Upload, Bell, TrendingUp } from 'lucide-react';

export default function LandingCoreFeatures() {
  const features = [
    {
      icon: Database,
      title: 'Immutable Ledger',
      description: 'Every stock change is an immutable transaction. Full auditability, historical traceability, and data consistency.',
    },
    {
      icon: Zap,
      title: 'Atomic Transactions',
      description: 'No partial writes. Guaranteed stock consistency preventing negative balances at the database level.',
    },
    {
      icon: Lock,
      title: 'Role-Based Access (RBAC)',
      description: 'Granular control with Admin, Operator, and Viewer roles. Fine-tune permissions per user and warehouse.',
    },
    {
      icon: Upload,
      title: 'Bulk CSV Operations',
      description: 'All-or-nothing atomic CSV imports with precise error reporting. Safely load thousands of items at once.',
    },
    {
      icon: Bell,
      title: 'Smart Alerts & Replenishment',
      description: 'Real-time low-stock evaluation and automated reorder insights grouped by vendor.',
    },
    {
      icon: TrendingUp,
      title: 'Real-Time Analytics',
      description: 'Live inventory dashboards with trend analysis, movement patterns, and predictive insights.',
    },
  ];

  return (
    <section className="py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-primary sm:text-4xl lg:text-5xl">
            Core Features Built for Enterprise
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to manage inventory with confidence and precision.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-ring/50"
              >
                <div className="mb-4 flex items-center justify-center size-10 rounded-lg bg-ring/10">
                  <Icon className="size-5 text-ring" />
                </div>
                <h3 className="mb-3 text-lg font-semibold text-primary">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
