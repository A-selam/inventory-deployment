'use client';

import { Lock, Server, DollarSign } from 'lucide-react';

export default function LandingSelfHostedAdvantage() {
  const advantages = [
    {
      icon: Lock,
      title: 'Your Data Stays Yours',
      description: 'Complete data sovereignty. Runs entirely on your infrastructure—your servers, your database, your firewall. Zero reliance on cloud vendors.',
    },
    {
      icon: Server,
      title: 'No Vendor Lock-In',
      description: 'Deploy on your on-premises servers, private cloud, or hybrid infrastructure. Migrate freely without losing access to historical data or audit trails.',
    },
    {
      icon: DollarSign,
      title: 'Flat Pricing, Unlimited Users',
      description: 'One license covers your entire team—no per-seat fees, no surprise costs as you scale. Hire as many people as you need.',
    },
  ];

  return (
    <section className="py-20 md:py-28 lg:py-32" id="self-hosted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted p-8 md:p-12 lg:p-16 animate-fade-in-up">
          <div className="grid gap-12 md:grid-cols-3">
            {advantages.map((advantage, idx) => {
              const Icon = advantage.icon;
              return (
                <div 
                  key={idx} 
                  className="flex flex-col gap-4 animate-fade-in-up"
                  style={{
                    animationDelay: `${idx * 100}ms`,
                  }}
                >
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
