"use client";

import "./globals.css";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className="dark bg-neutral-900">
        <main>{children}</main>
        <Toaster className="border-none" />
      </body>
    </html>
  );
}