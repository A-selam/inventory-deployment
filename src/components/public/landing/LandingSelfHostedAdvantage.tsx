'use client';

import { Lock, Server, DollarSign } from 'lucide-react';

export default function LandingSelfHostedAdvantage() {
  const advantages = [
    {
      icon: Lock,
      title: '100% Data Ownership',
      description: 'Your data stays under your control. No third-party access. Complete privacy and sovereignty.',
    },
    {
      icon: Server,
      title: 'Deploy Anywhere',
      description: 'Docker-ready containerized application. Deploy to your infrastructure, cloud, or on-premises.',
    },
    {
      icon: DollarSign,
      title: 'No Recurring Seat Fees',
      description: 'One-time license. No per-user costs. Add as many team members as you need.',
    },
  ];

  return (
    <section className="py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted p-8 md:p-12 lg:p-16">
          <div className="grid gap-12 md:grid-cols-3">
            {advantages.map((advantage, idx) => {
              const Icon = advantage.icon;
              return (
                <div key={idx} className="flex flex-col gap-4">
                  <div className="flex items-center justify-center size-12 rounded-lg bg-ring/10">
                    <Icon className="size-6 text-ring" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary">{advantage.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {advantage.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
