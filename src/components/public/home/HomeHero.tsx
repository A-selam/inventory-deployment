import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gauge, PackageCheck } from "lucide-react";

import heroBackground from "@/assets/hero_background.png";
import { trustSignals } from "./home-content";

export default function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden bg-slate-950">
      <Image
        src={heroBackground}
        alt="Warehouse team scanning and managing stocked shelves"
        priority
        fill
        sizes="100vw"
        className="absolute inset-0 -z-20 object-cover object-center"
      />
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(15,23,42,0.94)_0%,rgba(15,23,42,0.82)_43%,rgba(15,23,42,0.38)_100%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-linear-to-t from-slate-950 to-transparent"
        aria-hidden="true"
      />

      <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-6xl content-center gap-10 px-4 py-18 sm:px-6 sm:py-24 lg:grid-cols-[minmax(0,1.02fr)_minmax(20rem,0.62fr)] lg:items-end">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-100 shadow-sm backdrop-blur-md">
            <PackageCheck className="size-3.5 text-[#f28a2e]" />
            StockLogic Inventory Platform
          </div>

          <h1 className="mt-7 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Inventory operations with a clearer command center.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
            Bring products, warehouses, stock movements, low-stock alerts, and
            reporting into one focused workspace built for accurate daily
            control.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-semibold text-slate-950 shadow-lg shadow-slate-950/25 transition hover:bg-slate-100"
            >
              Get started
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="#company"
              className="inline-flex h-11 items-center justify-center rounded-md border border-white/25 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/15"
            >
              Learn more
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-white/15 bg-slate-950/58 p-4 shadow-2xl shadow-slate-950/30 backdrop-blur-md lg:mb-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Operations Snapshot
              </p>
              <p className="mt-1 text-sm font-medium text-white">
                Warehouse stock health
              </p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-md bg-[#f28a2e]/15 text-[#ffb26b]">
              <Gauge className="size-5" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 py-5">
            {trustSignals.map((signal) => (
              <div key={signal.label} className="min-w-0">
                <p className="text-xl font-semibold tracking-tight text-white">
                  {signal.value}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  {signal.label}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {["Main warehouse", "Retail stock", "Transfer queue"].map(
              (label, index) => (
                <div key={label}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200">{label}</span>
                    <span className="text-slate-400">
                      {[84, 68, 42][index]}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-[#f28a2e] to-[#3980f4]"
                      style={{ width: `${[84, 68, 42][index]}%` }}
                    />
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
