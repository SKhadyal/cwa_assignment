import './globals.css';
import Link from 'next/link';          // ← use Link in layout
import Header from '../components/header';
import Footer from '../components/footer';

export const metadata = {
  title: 'CWA Assignment',
  description: 'Dynamic site with code generator',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* suppress to avoid extension/theme SSR/CSR diffs */}
      <body suppressHydrationWarning>
        {/* Accessible Link placed in layout */}
        <Link href="/#main" className="skip-link">Skip to content</Link>

        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
