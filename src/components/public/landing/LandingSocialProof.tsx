"use client";

import {
  Building2,
  Package,
  Truck,
  Store,
  Factory,
  Warehouse,
} from "lucide-react";

const companies = [
  { name: "Northline Retail", icon: Store },
  { name: "Harbor Supply Co", icon: Warehouse },
  { name: "Metro Parts Group", icon: Package },
  { name: "Summit Logistics", icon: Truck },
  { name: "Atlas Manufacturing", icon: Factory },
  { name: "Vertex Distribution", icon: Building2 },
];

const duplicatedCompanies = [...companies, ...companies];

export default function LandingSocialProof() {
  return (
    <section className="pt-3 md:pt-6 lg:pt-12" id="trusted-by">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in-up">
          <p className="text-balance text-3xl font-semibold tracking-tight text-primary sm:text-4xl lg:text-5xl">
            Trusted by Leading Companies
          </p>
        </div>

        <div className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card/50 px-4 py-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl backdrop-blur-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-linear-to-r from-background via-background/80 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-linear-to-l from-background via-background/80 to-transparent" />

          <div className="motion-reduce:hidden overflow-hidden mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div className="flex w-max gap-4 px-1 animate-partners-marquee">
              {duplicatedCompanies.map((company, idx) => {
                const Icon = company.icon;
                return (
                  <article
                    key={`${company.name}-${idx}`}
                    className="flex min-w-56 flex-col items-center justify-center gap-3 rounded-2xl border border-border/70 bg-background/80 px-6 py-6 text-center shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] transition-transform duration-300 hover:-translate-y-1 hover:border-ring/50 hover:shadow-md"
                  >
                    <div className="flex size-11 items-center justify-center rounded-xl bg-muted">
                      <Icon className="size-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {company.name}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="hidden motion-reduce:grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {companies.map((company) => {
              const Icon = company.icon;
              return (
                <article
                  key={company.name}
                  className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border/70 bg-background/80 px-6 py-6 text-center shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex size-11 items-center justify-center rounded-xl bg-muted">
                    <Icon className="size-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {company.name}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
