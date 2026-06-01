import "./globals.css";
import type { ReactNode } from "react";
import QueryProvider from "@/providers/QueryProvider";
import { ToastProvider } from "@/providers/ToastProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <ToastProvider>{children}</ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
