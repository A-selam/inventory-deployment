import Link from "next/link";

export default function PublicFooter() {
  const year = new Date().getFullYear();
  
  const socialLinks = [
    { text: "𝕏", href: "https://twitter.com", label: "Twitter" },
    { text: "in", href: "https://linkedin.com", label: "LinkedIn" },
    { text: "GH", href: "https://github.com", label: "GitHub" },
    { text: "@", href: "mailto:contact@stocklogic.com", label: "Email" },
  ];

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
        <div className="py-12 grid gap-8 md:grid-cols-2 lg:grid-cols-5 mb-8">
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
                <a href="#core-features" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#capabilities" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Capabilities
                </a>
              </li>
              <li>
                <a href="#self-hosted" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Self-Hosted
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

          {/* Support */}
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-4">Support</p>
            <ul className="space-y-2">
              <li>
                <a href="#contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact Sales
                </a>
              </li>
              <li>
                <a href="mailto:support@stocklogic.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Support Email
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-4">Connect</p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center size-9 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors font-semibold text-sm"
                  aria-label={social.label}
                >
                  {social.text}
                </a>
              ))}
            </div>
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
