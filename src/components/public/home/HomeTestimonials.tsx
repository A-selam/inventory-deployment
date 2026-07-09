"use client";

import { Quote } from "lucide-react";
import { testimonials } from "./home-content";

export default function HomeTestimonials() {
  return (
    <section className="pt-6 md:pt-10 lg:pt-20" id="testimonials">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center animate-fade-in-up">
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-primary sm:text-4xl lg:text-5xl">
            Trusted by Operations Teams
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, idx) => (
            <article
              key={testimonial.name}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg animate-fade-in-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="mb-5 flex size-10 items-center justify-center rounded-lg bg-ring/10">
                <Quote className="size-5 text-ring" />
              </div>
              <p className="text-muted-foreground leading-relaxed">
                &quot;{testimonial.quote}&quot;
              </p>
              <div className="mt-6 border-t border-border pt-4">
                <p className="font-semibold text-primary">{testimonial.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {testimonial.role}, {testimonial.company}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
