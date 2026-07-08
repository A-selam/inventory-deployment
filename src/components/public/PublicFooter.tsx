import Link from "next/link";

export default function PublicFooter() {
  const year = new Date().getFullYear();

  const footerLinks = [
    { label: "Features", href: "#features" },
    { label: "Docs", href: "#docs" },
    { label: "API Reference", href: "#api" },
    { label: "Support", href: "#support" },
    { label: "Privacy", href: "#privacy" },
  ];

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Brand */}
          <div className="col-span-1">
            <p className="text-sm font-semibold text-primary">StockLogic</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Enterprise inventory management built for control and performance.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-4">Product</p>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#docs" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Developers */}
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-4">Developers</p>
            <ul className="space-y-2">
              <li>
                <a href="#api" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#docs" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Integration Guide
                </a>
              </li>
              <li>
                <a href="#support" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-4">Company</p>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {year} StockLogic. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built for enterprise inventory management.
          </p>
        </div>
      </div>
    </footer>
  );
}
