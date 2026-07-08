import type { ReactNode } from "react";
import PublicNav from "@/components/public/PublicNav";
import PublicFooter from "@/components/public/PublicFooter";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <PublicNav />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}
