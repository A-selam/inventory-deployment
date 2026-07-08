'use client';

import { ArrowRight, FileText } from 'lucide-react';

export default function LandingFinalCTA() {
  return (
    <section className="py-20 md:py-28 lg:py-32" id="contact">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted p-8 md:p-12 lg:p-16 text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-primary sm:text-4xl lg:text-5xl mb-4">
            Ready to Take Ownership of Your Inventory?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join enterprises that trust StockLogic for complete inventory control and data sovereignty.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
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
              Read Technical Specs
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
