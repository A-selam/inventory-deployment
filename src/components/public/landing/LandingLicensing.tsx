"use client";

import { Check } from "lucide-react";

export default function LandingLicensing() {
  return (
    <section className="pt-6 md:pt-10 lg:pt-20" id="licensing">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center animate-fade-in-up">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-primary sm:text-4xl lg:text-5xl">
            Licensing & Deployment
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Transparent pricing for complete control over your inventory system
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* License Option 1 */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg animate-fade-in-up">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-primary">
                Perpetual License
              </h3>
              <p className="mt-2 text-muted-foreground">One-time purchase</p>
              <div className="mt-4">
                <span className="text-4xl font-bold text-primary">
                  Contact Us
                </span>
              </div>
            </div>
            <ul className="mb-8 space-y-3">
              {[
                "Unlimited users",
                "Unlimited warehouses",
                "Full source code access",
                "1 year of updates included",
                "Email support",
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Check className="size-5 text-green-600" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              Get Pricing
            </a>
          </div>

          {/* License Option 2 */}
          <div className="rounded-2xl border-2 border-ring bg-linear-to-b from-card to-muted p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg animate-fade-in-up animate-delay-100">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-primary">
                Enterprise License
              </h3>
              <p className="mt-2 text-muted-foreground">Full service</p>
              <div className="mt-4">
                <span className="text-4xl font-bold text-primary">
                  Contact Us
                </span>
              </div>
            </div>
            <ul className="mb-8 space-y-3">
              {[
                "Everything in Perpetual",
                "Dedicated support engineer",
                "Installation assistance",
                "Custom feature development",
                "Priority bug fixes",
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Check className="size-5 text-green-600" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              className="inline-flex w-full items-center justify-center rounded-lg bg-ring px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-ring/90"
            >
              Contact Sales
            </a>
          </div>

          {/* Deployment Options */}
          {/* <div className="rounded-2xl border border-border bg-card p-8 shadow-sm animate-fade-in-up animate-delay-200">
            <h3 className="mb-6 text-xl font-semibold text-primary">
              Deployment Options
            </h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-ring/10">
                  <Server className="size-5 text-ring" />
                </div>
                <div>
                  <h4 className="font-semibold text-primary">On-Premises</h4>
                  <p className="text-sm text-muted-foreground">
                    Install on your own hardware behind your firewall
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-ring/10">
                  <Shield className="size-5 text-ring" />
                </div>
                <div>
                  <h4 className="font-semibold text-primary">Private Cloud</h4>
                  <p className="text-sm text-muted-foreground">
                    Deploy on AWS, GCP, Azure, or your private cloud
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-ring/10">
                  <Zap className="size-5 text-ring" />
                </div>
                <div>
                  <h4 className="font-semibold text-primary">Docker</h4>
                  <p className="text-sm text-muted-foreground">
                    One-click deployment with Docker containers
                  </p>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
}
