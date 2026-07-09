"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

type FAQItem = {
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    question: "How do we get software updates?",
    answer:
      "You'll receive regular updates via our customer portal. Perpetual licenses include 1 year of updates, and Enterprise licenses include ongoing updates as part of your agreement. Updates are easy to apply with our built-in update mechanism or via Docker images.",
  },
  {
    question: "Do you offer installation support?",
    answer:
      "Yes! Enterprise licenses include dedicated installation assistance from our engineering team. We'll help you set up the system, migrate your existing data, and train your team. For Perpetual licenses, installation support is available as an add-on service.",
  },
  {
    question: "What are the minimum server requirements?",
    answer:
      "Minimum requirements: 4 CPU cores, 8 GB RAM, 50 GB storage. We recommend: 8+ CPU cores, 16+ GB RAM, 100+ GB SSD storage for production use. The system runs on Linux, Windows, or macOS via Docker.",
  },
  {
    question: "Can we migrate our existing CSV data?",
    answer:
      "Absolutely! Our built-in CSV import tool supports importing items, vendors, warehouses, and stock levels. We provide detailed templates and documentation, and our support team can help with complex migrations.",
  },
  {
    question: "Is there a limit on the number of users or items?",
    answer:
      "No! All our licenses include unlimited users, unlimited items, and unlimited warehouses. You can scale your inventory operations without worrying about per-user fees or arbitrary limits.",
  },
  {
    question: "What database does it use?",
    answer:
      "StockLogic uses PostgreSQL for reliable, ACID-compliant data storage. This ensures your inventory data is safe, consistent, and can handle high transaction volumes.",
  },
];

export default function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="pt-6 md:pt-10 lg:pt-20" id="faq">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center animate-fade-in-up">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-primary sm:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to know about StockLogic
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg animate-fade-in-up"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="flex w-full items-center justify-between px-6 py-4 text-left"
              >
                <span className="text-base font-semibold text-primary">
                  {faq.question}
                </span>
                {openIndex === idx ? (
                  <ChevronUp className="size-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="size-5 text-muted-foreground" />
                )}
              </button>
              {openIndex === idx && (
                <div className="px-6 pb-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
