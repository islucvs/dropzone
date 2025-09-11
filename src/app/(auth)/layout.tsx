import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DROPZONE | Login",
  description: "RTS Game",
};

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>{children}</>
  );
}