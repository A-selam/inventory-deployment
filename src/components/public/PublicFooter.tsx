import Link from "next/link";

import { socials } from "@/components/public/home/home-content";

export default function PublicFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-950">StockLogic</p>
          <p className="mt-1 text-sm text-slate-500">
            Inventory control for growing warehouse and retail teams.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {socials.map((social) => (
            <Link
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
            >
              {social.label}
            </Link>
          ))}
        </div>

        <p className="text-sm text-slate-400">
          &copy; {year} StockLogic. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
