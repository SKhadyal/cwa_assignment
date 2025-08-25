// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/header"; // or "@/components/header" if alias is set

export const metadata: Metadata = {
  title: "SKOPE",
  description: "Remote telescope platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning prevents errors when extensions inject attributes
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
