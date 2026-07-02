import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { socials } from "./home-content";

export default function HomeSocials() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-8 rounded-lg border border-slate-200 bg-slate-50 p-6 sm:p-8 lg:grid-cols-[0.82fr_1fr] lg:items-center">
        <div>
          <p className="label-caps text-[#3980f4]">Socials</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Follow StockLogic for product updates and inventory operations
            ideas.
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {socials.map((social) => (
            <Link
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:text-slate-950"
            >
              {social.label}
              <ExternalLink className="size-4 text-slate-400" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
