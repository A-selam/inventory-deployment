"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Archive, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Features", href: "#core-features" },
  { label: "Capabilities", href: "#capabilities" },
  // { label: "Self-Hosted", href: "#self-hosted" },
  { label: "Licensing", href: "#licensing" },
  { label: "FAQ", href: "#faq" },
];

export default function PublicNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/home" className="flex shrink-0 items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center self-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Archive className="size-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-primary">
            StockLogic
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
                isActive(link.href) ? "underline" : "",
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-primary border border-border hover:bg-muted transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="#contact"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            Contact Sales
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted md:hidden transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "overflow-hidden border-t border-border bg-card/95 backdrop-blur-md transition-all duration-200 md:hidden",
          open ? "max-h-96 py-4" : "max-h-0",
        )}
      >
        <nav className="flex flex-col gap-1 px-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-border px-4 py-2.5 text-center text-sm font-semibold text-primary hover:bg-muted transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="#contact"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
