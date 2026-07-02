import Link from "next/link";
import {
  Package,
  Building2,
  ArrowRightLeft,
  Bell,
  Users,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Archive,
} from "lucide-react";

// ─── Feature cards ────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Package,
    title: "Inventory Management",
    points: [
      "Add, update, and remove products",
      "Categorize inventory by type",
      "Monitor stock quantities in real time",
    ],
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Building2,
    title: "Warehouse Management",
    points: [
      "Manage multiple warehouses",
      "Organize inventory by location",
      "Transfer stock between warehouses",
    ],
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: ArrowRightLeft,
    title: "Stock Movement Tracking",
    points: [
      "Record stock in and stock out",
      "View complete movement history",
      "Maintain accurate inventory records",
    ],
    color: "bg-teal-50 text-teal-600",
  },
  {
    icon: Bell,
    title: "Low Stock Alerts",
    points: [
      "Identify products running low",
      "Prevent stock shortages",
      "Restock before inventory runs out",
    ],
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Users,
    title: "User Management",
    points: [
      "Secure user authentication",
      "Role-based access control",
      "Manage staff accounts securely",
    ],
    color: "bg-violet-50 text-violet-600",
  },
  {
    icon: TrendingUp,
    title: "Reports & Insights",
    points: [
      "View inventory statistics",
      "Monitor stock trends over time",
      "Analyze warehouse activity",
    ],
    color: "bg-emerald-50 text-emerald-600",
  },
];

const BENEFITS = [
  "Easy to use interface",
  "Fast and secure",
  "Accurate inventory tracking",
  "Multiple warehouse support",
  "Designed for businesses of all sizes",
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-24 sm:px-6 sm:py-32">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-32 -left-32 size-[500px] rounded-full bg-blue-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 size-[400px] rounded-full bg-indigo-500/15 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-slate-300">
            <Archive className="size-3.5" />
            StockLogic Platform
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Inventory Management
            <span className="mt-1 block text-blue-400">Made Simple</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Track inventory, monitor stock movements, and manage warehouses from
            one centralized platform. Built to help businesses maintain accurate
            inventory records and improve operational efficiency.
          </p>

          
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-slate-50 px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
              Platform Capabilities
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              What Our System Provides
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-slate-500">
              Everything you need to run inventory operations efficiently — in
              one place.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div
                  className={`mb-4 inline-flex size-11 items-center justify-center rounded-xl ${feature.color}`}
                >
                  <feature.icon className="size-5" />
                </div>
                <h3 className="mb-3 text-base font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <ul className="space-y-1.5">
                  {feature.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2 text-sm text-slate-500"
                    >
                      <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="bg-white px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-20">
            {/* Left copy */}
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                Why Choose Us
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Why Choose Our System?
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-500">
                Built for teams that need reliable, fast, and accurate inventory
                control without the complexity.
              </p>
            </div>

            {/* Right checklist */}
            <div className="flex-1">
              <ul className="space-y-4">
                {BENEFITS.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-100">
                      <CheckCircle2 className="size-3.5 text-blue-600" />
                    </div>
                    <span className="text-base font-medium text-slate-700">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-20 text-center sm:px-6 sm:py-28">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to manage your inventory more efficiently?
          </h2>
          <p>Sign in to access your inventory management dashboard and securely manage your products, warehouses, stock movements, and account. Enter your registered email and password to continue. If you've forgotten your password, you can easily request a password reset to regain access to your account.</p>
          <p className="mx-auto mt-4 text-base leading-7 text-slate-300">
            Create an account today and simplify your inventory operations.
          </p>
          
        </div>
      </section>
    </div>
  );
}
