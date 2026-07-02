import Link from "next/link";
import {
  Package,
  Building2,
  ArrowRightLeft,
  Bell,
  Users,
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowRight,
} from "lucide-react";

const OFFERINGS = [
  { icon: Package, label: "Product inventory management" },
  { icon: Building2, label: "Warehouse management" },
  { icon: ArrowRightLeft, label: "Stock movement tracking" },
  { icon: Bell, label: "Low stock monitoring" },
  { icon: Users, label: "Secure authentication and user management" },
  { icon: TrendingUp, label: "Inventory reports and insights" },
];

const TECH_HIGHLIGHTS = [
  { icon: Zap, label: "Modern, responsive user interface" },
  { icon: ShieldCheck, label: "Secure authentication" },
  { icon: ArrowRightLeft, label: "RESTful backend architecture" },
  { icon: TrendingUp, label: "Scalable database design" },
  { icon: Package, label: "Real-time inventory management" },
];

export default function AboutPage() {
  return (
    <div className="overflow-x-hidden">
      {/* ── Hero / Intro ── */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-20 sm:px-6 sm:py-28 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute -top-40 left-1/4 size-[500px] rounded-full bg-blue-600/15 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">
            Our Story
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            About Our Inventory Management System
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Our Inventory Management System is designed to simplify the way
            businesses manage products, warehouses, and inventory movements. It
            provides a centralized platform for tracking stock levels, recording
            inventory transactions, and maintaining accurate records across
            multiple warehouses. Whether you&apos;re managing a small store or a
            growing business, our system helps reduce manual work, minimize
            inventory errors, and improve operational efficiency.
          </p>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="bg-white px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
              Core Pillars
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Mission &amp; Vision
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Mission */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-blue-100">
                <ShieldCheck className="size-6 text-blue-600" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900">
                Our Mission
              </h3>
              <p className="text-base leading-7 text-slate-600">
                To provide businesses with a reliable, secure, and user-friendly
                inventory management solution that makes stock management simple
                and efficient.
              </p>
            </div>

            {/* Vision */}
            <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-blue-600">
                <TrendingUp className="size-6 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900">
                Our Vision
              </h3>
              <p className="text-base leading-7 text-slate-600">
                To empower businesses with modern inventory management tools
                that improve productivity, accuracy, and decision-making.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── What We Offer + Built With ── */}
      <section className="bg-slate-50 px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
              Platform Summary
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              What We Offer
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Offerings */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="mb-6 text-base font-semibold uppercase tracking-wider text-slate-500">
                Features &amp; Capabilities
              </h3>
              <ul className="space-y-4">
                {OFFERINGS.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                      <Icon className="size-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech highlights */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="mb-6 text-base font-semibold uppercase tracking-wider text-slate-500">
                Built With
              </h3>
              <ul className="space-y-4">
                {TECH_HIGHLIGHTS.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
                      <Icon className="size-4 text-indigo-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
