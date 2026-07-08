'use client';

import { ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const chartData = [
  { name: 'Jan', value: 4200 },
  { name: 'Feb', value: 5100 },
  { name: 'Mar', value: 4900 },
  { name: 'Apr', value: 6200 },
  { name: 'May', value: 5800 },
  { name: 'Jun', value: 7100 },
];

const lowStockData = [
  { name: 'SKU-001', count: 5 },
  { name: 'SKU-042', count: 8 },
  { name: 'SKU-089', count: 3 },
];

export default function LandingHero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-20 md:pt-32 lg:pt-40">
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left column - Text content */}
          <div className="flex flex-col gap-6">
            <div className="space-y-4">
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-primary sm:text-5xl lg:text-6xl">
                Own Your Inventory Completely
              </h1>
              <p className="text-balance text-lg text-muted-foreground sm:text-xl">
                Deploy a self-hosted, centralized inventory platform with an immutable transaction ledger. Full control over your data. Real-time analytics. Zero recurring seat fees.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 pt-4">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 text-lg font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                Request a Demo
                <ArrowRight className="size-4" />
              </a>
              <a
                href="#docs"
                className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-4 text-lg font-semibold text-foreground hover:bg-muted transition-colors"
              >
                View Documentation
              </a>
            </div>

            {/* Trust indicators */}
            <div className="flex gap-4 pt-4 flex-wrap text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-ring" />
                <span>Sub-200ms CRUD response</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-ring" />
                <span>Docker containerized</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-ring" />
                <span>PostgreSQL backed</span>
              </div>
            </div>
          </div>

          {/* Right column - Dashboard mockup */}
          <div className="relative">
            <div className="space-y-4">
              {/* Card 1: Stock Movement Chart */}
              <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-primary">Stock Movement</h3>
                  <span className="text-xs text-muted-foreground">Last 6 months</span>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
                    <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="var(--ring)"
                      strokeWidth={2}
                      dot={{ fill: 'var(--ring)', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Card 2: Low Stock Alerts */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-primary">Low Stock Alerts</h3>
                    <span className="rounded bg-destructive/10 px-2 py-1 text-xs font-semibold text-destructive">
                      3
                    </span>
                  </div>
                  <ResponsiveContainer width="100%" height={120}>
                    <BarChart data={lowStockData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="name" stroke="var(--muted-foreground)" style={{ fontSize: '10px' }} />
                      <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '10px' }} />
                      <Bar dataKey="count" fill="var(--destructive)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Card 3: Total Inventory Value */}
                <div className="rounded-lg border border-border bg-card p-4 shadow-sm flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Inventory Value</p>
                    <p className="mt-2 text-2xl font-semibold text-primary">$847,320</p>
                  </div>
                  <p className="text-xs text-green-600 font-medium">↑ 12% from last month</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
