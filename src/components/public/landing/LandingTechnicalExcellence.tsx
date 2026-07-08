'use client';

import { Gauge, Box, Database, Code } from 'lucide-react';

export default function LandingTechnicalExcellence() {
  const highlights = [
    {
      icon: Gauge,
      title: 'Lightning-Fast Performance',
      metric: '<200ms',
      description: 'CRUD response target for maximum operational efficiency.',
    },
    {
      icon: Box,
      title: 'Containerized',
      metric: 'Docker',
      description: 'Deploy anywhere. On-premises, cloud, or hybrid infrastructure.',
    },
    {
      icon: Database,
      title: 'Database-Backed',
      metric: 'PostgreSQL',
      description: 'Reliable, scalable SQL database with enterprise support.',
    },
    {
      icon: Code,
      title: 'Robust API',
      metric: 'FastAPI',
      description: 'RESTful JSON standard responses for seamless integrations.',
    },
  ];

  return (
    <section className="py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-primary sm:text-4xl lg:text-5xl">
            Built for Performance & Reliability
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Modern architecture designed for operational excellence.
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

        {/* Technical details bento grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-gradient-to-br from-card to-muted p-8">
            <h3 className="mb-4 text-xl font-semibold text-primary">API-First Architecture</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Built on FastAPI with full OpenAPI documentation. Integrate with any system, build custom applications, and extend functionality with our comprehensive REST API.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-ring" />
                Comprehensive OpenAPI docs
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-ring" />
                JSON standard responses
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-ring" />
                Webhook support for events
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-gradient-to-br from-card to-muted p-8">
            <h3 className="mb-4 text-xl font-semibold text-primary">Enterprise Security</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Role-based access control, encrypted data in transit and at rest, audit logging of all operations, and compliance-ready security controls.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-ring" />
                Full audit trail logging
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-ring" />
                Granular RBAC
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-ring" />
                Encrypted communications
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
