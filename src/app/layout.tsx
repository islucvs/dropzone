"use client";

import "./globals.css";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="dark bg-neutral-900">
        <main>{children}</main>
        <Toaster 
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: '#0a0a0a',
              border: '1px solid #fc5c00',
              borderRadius: '0px',
              color: 'white',
              fontFamily: 'monospace',
              fontSize: '14px',
            },
            className: 'font-sans',
          }}
          richColors
        />
      </body>
    </html>
  );
}