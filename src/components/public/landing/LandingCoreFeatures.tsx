'use client';

import { Database, Zap, Lock, Upload, Bell, TrendingUp } from 'lucide-react';

export default function LandingCoreFeatures() {
  const features = [
    {
      icon: Database,
      title: 'Complete Record History',
      description: 'Every inventory change is recorded forever. See exactly what happened, when it happened, and who made the change. Perfect for audits and investigations.',
    },
    {
      icon: Zap,
      title: 'No More Mistakes',
      description: 'Our system prevents impossible situations like negative stock. Every transaction is either completed fully or not at all—no partial updates.',
    },
    {
      icon: Lock,
      title: 'Control Who Does What',
      description: 'Managers, warehouse workers, and viewers each see what they need. Prevent unauthorized changes while keeping operations flowing.',
    },
    {
      icon: Upload,
      title: 'Quick Bulk Updates',
      description: 'Upload thousands of items at once using Excel or CSV files. If anything looks wrong, we tell you exactly what needs fixing.',
    },
    {
      icon: Bell,
      title: 'Smart Stock Alerts',
      description: 'Get notified when items run low. See automatic reorder suggestions grouped by supplier so you can plan ahead.',
    },
    {
      icon: TrendingUp,
      title: 'See Your Business in Real-Time',
      description: 'Beautiful charts show what&apos;s selling, what&apos;s sitting, and where your money is tied up. Make decisions based on actual data.',
    },
  ];

  return (
    <section className="py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-primary sm:text-4xl lg:text-5xl">
            Built for the Way You Work
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Smart tools that solve real inventory problems without getting in the way.
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
