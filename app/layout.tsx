import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import Script from "next/script";
import "./globals.css";

import Header from "../components/header";
import Footer from "../components/footer";

export const metadata: Metadata = {
  title: "CWA Assignment",
  description: "Student project",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <Header />
        <main id="main" className="container-fluid py-3">{children}</main>
        <Footer />
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" />
      </body>
    </html>
  );
}
