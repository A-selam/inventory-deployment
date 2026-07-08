'use client';

import { Gauge, Box, Database, Code } from 'lucide-react';

export default function LandingTechnicalExcellence() {
  const highlights = [
    {
      icon: Gauge,
      title: 'Instant Results',
      metric: 'Lightning Fast',
      description: 'Search and update your inventory instantly. No more waiting around for systems to catch up.',
    },
    {
      icon: Box,
      title: 'Deploy Anywhere',
      metric: 'Your Choice',
      description: 'Run it on your own servers, in the cloud, or split across multiple locations. You\'re in control.',
    },
    {
      icon: Database,
      title: 'Rock-Solid Reliability',
      metric: 'Enterprise Grade',
      description: 'Trusted database technology that powers the world\'s biggest companies. Your data is safe.',
    },
    {
      icon: Code,
      title: 'Works With Everything',
      metric: 'Easy Integration',
      description: 'Connect to your existing tools and systems. Our open design means you\'re never locked in.',
    },
  ];

  return (
    <section className="py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-primary sm:text-4xl lg:text-5xl">
            Designed to Last
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Fast, reliable, and built to grow with your business.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {highlights.map((highlight, idx) => {
            const Icon = highlight.icon;
            return (
              <div
                key={idx}
                className="rounded-lg border border-border bg-card p-6 shadow-sm text-center"
              >
                <div className="mb-4 flex items-center justify-center size-12 rounded-lg bg-ring/10 mx-auto">
                  <Icon className="size-6 text-ring" />
                </div>
                <p className="mb-2 text-sm font-semibold text-ring uppercase tracking-wide">
                  {highlight.metric}
                </p>
                <h3 className="mb-3 text-lg font-semibold text-primary">{highlight.title}</h3>
                <p className="text-sm text-muted-foreground">{highlight.description}</p>
              </div>
            );
          })}
        </div>

        {/* Key benefits */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-gradient-to-br from-card to-muted p-8">
            <h3 className="mb-4 text-xl font-semibold text-primary">Works With Your Tools</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Plug into your accounting software, e-commerce platform, or custom systems. Built to work alongside the tools you already trust.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-ring" />
                Connect to what you already use
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-ring" />
                Automatic real-time syncing
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-ring" />
                No complicated setup required
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-gradient-to-br from-card to-muted p-8">
            <h3 className="mb-4 text-xl font-semibold text-primary">Protect Your Business</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Control exactly who can access what. See every change that happens. Prevent fraud and mistakes with built-in safeguards.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-ring" />
                Know who did what and when
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-ring" />
                Prevent unauthorized access
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-ring" />
                Data encrypted everywhere
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
