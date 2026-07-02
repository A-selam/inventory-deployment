import { Quote } from "lucide-react";

import { testimonials } from "./home-content";

export default function HomeTestimonials() {
  return (
    <section
      id="testimonials"
      className="bg-[#f7f9fb] px-4 py-20 sm:px-6 sm:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="label-caps text-[#3980f4]">Testimonials</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Operators want fewer blind spots and faster answers.
          </h2>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-5 flex size-10 items-center justify-center rounded-md bg-slate-950 text-[#ffb26b]">
                <Quote className="size-5" />
              </div>
              <p className="text-sm leading-7 text-slate-700">
                {testimonial.quote}
              </p>
              <div className="mt-6 border-t border-slate-200 pt-4">
                <p className="font-semibold text-slate-950">
                  {testimonial.name}
                </p>
                <p className="mt-1 text-sm text-slate-500">
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
