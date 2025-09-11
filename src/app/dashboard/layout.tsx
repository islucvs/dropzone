import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";
import { Metadata } from "next";
import { ThemeProvider } from '@/components/ui/theme-provider';

export const metadata: Metadata = {
  title: "DROPZONE",
  description: "RTS Game",
};

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider
    className="bg-transparent text-black"
    >
      <aside className="dark">
        <SidebarTrigger className="absolute md:hidden">
          <Menu size={24} />
        </SidebarTrigger>
        <AppSidebar />
      </aside>
      <main className="w-full text-white bg-neutral-950">
        {children}
      </main>
    </SidebarProvider>
  );
}