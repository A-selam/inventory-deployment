"use client";

import { ArrowRight, FileText } from "lucide-react";

export default function LandingFinalCTA() {
  return (
    <section className="py-6 md:py-10 lg:py-20" id="contact">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-linear-to-br from-card to-muted p-8 text-center transition-all hover:-translate-y-1 hover:shadow-xl md:p-12 lg:p-16 animate-fade-in-up">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-primary sm:text-4xl lg:text-5xl mb-4 animate-fade-in-up">
            Take Control of Your Inventory
          </h2>
          <p className="text-lg text-muted-foreground mb-8 animate-fade-in-up animate-delay-100">
            Deploy a complete inventory system that never loses a transaction,
            guarantees accuracy, and gives you the compliance audit trail you
            need.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4 animate-fade-in-up animate-delay-200">
            <a
              href="mailto:sales@stocklogic.com"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 text-lg font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              Contact Sales
              <ArrowRight className="size-4" />
            </a>
            <a
              href="#docs"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-6 py-4 text-lg font-semibold text-foreground hover:bg-muted transition-colors"
            >
              <FileText className="size-4" />
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
