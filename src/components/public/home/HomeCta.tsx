import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function HomeCta() {
  return (
    <section className="bg-slate-950 px-4 py-18 text-white sm:px-6 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <h2 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Give your team a cleaner way to manage stock before exceptions turn
            into delays.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
            Sign in to access products, warehouses, stock movements, alerts,
            reports, and account management from one secure dashboard.
          </p>
        </div>

        <Link
          href="/login"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-semibold text-slate-950 shadow-lg shadow-black/20 transition hover:bg-slate-100 lg:justify-self-end"
        >
          Sign In
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
