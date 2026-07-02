"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Archive, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import logo from "../../assets/logo.png";

const NAV_LINKS = [{ label: "Home", href: "/home" }];

export default function PublicNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/home" className="flex shrink-0 items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center self-center rounded-sm bg-primary text-primary-foreground shadow-sm">
            <Archive className="size-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-slate-900">
            StockLogic
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  active
                    ? "text-slate-900 underline underline-offset-4"
                    : "text-slate-600 hover:text-slate-900",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-700"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "overflow-hidden border-t border-slate-200/60 bg-white/95 backdrop-blur-md transition-all duration-200 md:hidden",
          open ? "max-h-80 py-4" : "max-h-0",
        )}
      >
        <nav className="flex flex-col gap-1 px-4">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm font-medium",
                  active
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-700 hover:bg-slate-100",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-md border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-md bg-slate-900 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-slate-700"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
